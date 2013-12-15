#coding:utf-8
import datetime
from flask import jsonify
from flask.blueprints import Blueprint
from flask.ext.login import current_user
from flask.globals import request, session
from sqlalchemy.orm import joinedload
from models.achievement import Achievement
from models.todo import Todo
from utils.db_utils.database_session import session_cm
from utils.response import ajax_response

todo = Blueprint('todo', __name__)


@todo.route('/add_todo', methods=["POST"])
def add_todo():
    todo_name = request.form.get("todo_name")
    todo_description = request.form.get("todo_description")
    todo_start = request.form.get("todo_start")
    todo_end = request.form.get("todo_end")
    todo_visible = request.form.get("todo_visible") is not None
    todo_erasable = request.form.get("todo_erasable") is None
    res = ajax_response()
    with session_cm() as db:
        td = Todo(user_id=current_user.user_id,
                  todo_name=todo_name,
                  todo_description=todo_description,
                  todo_start=todo_start,
                  todo_end=todo_end,
                  todo_visible=todo_visible,
                  todo_erasable=todo_erasable)
        db.add(td)
        db.commit()
        res.update(data=td.to_dict())
    return jsonify(res)


@todo.route('/mark_complete')
def mark_complete():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    with session_cm() as db:
        td = db.query(Todo).get(todo_id)
        td.todo_is_completed = not td.todo_is_completed
        res['data'] = td.to_dict()
        res['info'] = '成功标记该计划为已完成' if td.todo_is_completed else '成功标记该计划为未完成'
        db.commit()
    return jsonify(res)


@todo.route('/delete_todo')
def delete_todo():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    with session_cm() as db:
        td = db.query(Todo).get(todo_id)
        td.todo_is_deleted = True
        res['info'] = '删除成功'
        db.commit()
    return jsonify(res)


@todo.route('/change_visible')
def change_visible():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    with session_cm() as db:
        td = db.query(Todo).get(todo_id)
        td.todo_visible = not td.todo_visible
        res['data'] = td.to_dict()
        res['info'] = '成功设置该计划对所有人可见' if td.todo_visible else '成功设置该计划为私密计划'
        db.commit()
    return jsonify(res)


@todo.route('/down_vote', methods=['GET'])
def down_vote():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    if not current_user.is_authenticated():
        res.update({
            'info': '还木有登录呢，太没诚意了……',
            'type': 'error'
        })
        return jsonify(res)
    if request.cookies.get('voted_todo_' + str(todo_id)):
        res.update({
            'info': '你已经表示过了，谢谢了哈……',
            'type': 'info'
        })
        return jsonify(res)
    with session_cm() as db:
        td = db.query(Todo).get(todo_id)
        if not td.todo_down_vote:
            td.todo_down_vote = 0
        td.todo_down_vote += 1
        res.update(data=td.todo_down_vote)
        res.update({
            'data': td.todo_down_vote,
            'info': '如果你真心觉得不靠谱，希望你能给予正确的指点或者意见，谢谢！'
        })
        db.commit()
        response = jsonify(res)
        response.set_cookie('voted_todo_' + str(todo_id), 'voted')
        return response


@todo.route('/up_vote', methods=['GET'])
def up_vote():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    if not current_user.is_authenticated():
        res.update({
            'info': '还木有登录呢，太没诚意了……',
            'type': 'error'
        })
        return jsonify(res)
    if request.cookies.get('voted_todo_' + str(todo_id)):
        res.update({
            'info': '你已经表示过了，谢谢了哈……',
            'type': 'info'
        })
        return jsonify(res)
    with session_cm() as db:
        td = db.query(Todo).get(todo_id)
        if not td.todo_up_vote:
            td.todo_up_vote = 0
        td.todo_up_vote += 1
        res.update({
            'data': td.todo_up_vote,
            'info': '鼓励别人，也是一种美德，谢谢！'
        })
        db.commit()
        response = jsonify(res)
        response.set_cookie('voted_todo_' + str(todo_id), 'voted')
        return response


@todo.route('/add_ac', methods=['POST'])
def add_new_complete():
    res = ajax_response()
    ac_name = request.form.get('ac_name')
    ac_description = request.form.get('ac_description')
    todo_id = request.form.get('todo_id')
    with session_cm() as db:
        ac = Achievement(ac_name=ac_name,
                         ac_description=ac_description,
                         todo_id=todo_id,
                         user_id=current_user.user_id)
        db.add(ac)
        db.commit()
        res.update(data=ac.to_dict())
    return jsonify(res)


@todo.route('/latest_todos')
def latest_todos():
    res = ajax_response()
    with session_cm() as db:
        latest_todo_list = db.query(Todo).\
            filter(Todo.todo_is_deleted == False,
                   Todo.todo_visible == True).order_by(Todo.created_date.asc()).all()
        items = []
        for td in latest_todo_list:
            items.append(td.to_dict())
        res.update(data={
            'items': items
        })
    return jsonify(res)


@todo.route('/my_todos')
def my_todos():
    res = ajax_response()
    flag = request.args.get('flag', 'doing')
    with session_cm() as db:
        my_todo_list_query = db.query(Todo). \
            filter(Todo.todo_is_deleted == False,
                   Todo.user_id == session["owner_id"])

        if not current_user.is_authenticated() or \
                (current_user.is_authenticated() and current_user.user_id != session["owner_id"]):
            my_todo_list_query = my_todo_list_query.filter(Todo.todo_visible == True)

        if flag and flag == 'doing':
            my_todo_list_query = my_todo_list_query.\
                filter(Todo.todo_is_completed == False,
                       Todo.todo_end > datetime.date.today())

        if flag and flag == 'completed':
            my_todo_list_query = my_todo_list_query.\
                filter(Todo.todo_is_completed == True)

        if flag and flag == 'failed':
            my_todo_list_query = my_todo_list_query.\
                filter(Todo.todo_is_completed == False,
                       Todo.todo_end < datetime.date.today())

        my_todo_list = my_todo_list_query.options(joinedload('achievement_list')).all()

        items = []
        for td in my_todo_list:
            items.append(td.to_dict())
        res.update(data={
            'items': items
        })

    return jsonify(res)