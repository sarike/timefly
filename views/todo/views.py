#coding:utf-8
import datetime
from flask import jsonify
from flask.blueprints import Blueprint
from flask.ext.login import current_user
from flask.globals import request
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