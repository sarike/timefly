#coding:utf-8
import datetime
from flask import jsonify
from flask.blueprints import Blueprint
from flask.ext.login import current_user
from flask.globals import request, g, session
from flask.templating import render_template
from werkzeug.exceptions import abort
from models.todo import Todo
from models.user import User
from utils.database_session import session_cm
from utils.response import ajax_response

todo = Blueprint('todo', __name__)


@todo.route('/add_todo', methods=["POST"])
def add_todo():
    todo_name = request.form.get("todo_name")
    todo_description = request.form.get("todo_description")
    todo_start = request.form.get("todo_start")
    todo_end = request.form.get("todo_end")
    todo_visible = request.form.get("todo_visible") is not None
    todo_erasable = request.form.get("todo_erasable") is not None
    res = ajax_response()
    with session_cm() as session:
        todo = Todo(user_id=current_user.user_id,
                    todo_name=todo_name,
                    todo_description=todo_description,
                    todo_start=todo_start,
                    todo_end=todo_end,
                    todo_visible=todo_visible,
                    todo_erasable=todo_erasable)
        session.add(todo)
        session.commit()
        res.update(data=todo.to_dict())
    return jsonify(res)


@todo.route('/mark_complete')
def mark_complete():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    with session_cm() as db:
        todo = db.query(Todo).get(todo_id)
        todo.todo_is_completed = not todo.todo_is_completed
        res['data'] = todo.to_dict()
        res['info'] = '成功标记该计划为已完成' if todo.todo_is_completed else '成功标记该计划为未完成'
        db.commit()
    return jsonify(res)


@todo.route('/delete_todo')
def delete_todo():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    with session_cm() as db:
        todo = db.query(Todo).get(todo_id)
        db.delete(todo)
        res['info'] = '删除成功'
        db.commit()
    return jsonify(res)


@todo.route('/change_visible')
def change_visible():
    res = ajax_response()
    todo_id = request.args.get('todo_id')
    with session_cm() as db:
        todo = db.query(Todo).get(todo_id)
        todo.todo_visible = not todo.todo_visible
        res['data'] = todo.to_dict()
        res['info'] = '成功设置该计划对所有人可见' if todo.todo_visible else '成功设置该计划为私密计划'
        db.commit()
    return jsonify(res)


@todo.route('/add_new_complete')
def add_new_complete():
    pass


@todo.route('/latest_todos')
def latest_todos():
    res = ajax_response()
    with session_cm() as session:
        latest_todo_list = session.query(Todo).\
            filter(Todo.todo_is_deleted == False).order_by(Todo.created_date.asc()).all()
        items = []
        for todo in latest_todo_list:
            items.append(todo.to_dict())
        res.update(data={
            'items': items
        })
    return jsonify(res)


@todo.route('/my_todos')
def my_todos():
    res = ajax_response()
    with session_cm() as db:
        my_todo_list_query = db.query(Todo). \
            filter(Todo.todo_is_deleted == False,
                   Todo.user_id == session["owner_id"])

        if current_user.is_authenticated() and current_user.user_id != session["owner_id"]:
            my_todo_list_query = my_todo_list_query.filter(Todo.todo_visible == True)

        my_todo_list = my_todo_list_query.all()

        items = []
        for todo in my_todo_list:
            items.append(todo.to_dict())
        res.update(data={
            'items': items
        })

    return jsonify(res)