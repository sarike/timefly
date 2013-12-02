#coding:utf-8
import datetime
from flask import jsonify
from flask.blueprints import Blueprint
from flask.ext.login import current_user
from flask.globals import session
from flask.templating import render_template
from werkzeug.exceptions import abort
from config import settings
from models.user import User
from utils.database_session import session_cm
from utils.response import ajax_response

frontend = Blueprint('frontend', __name__)


@frontend.route('/')
@frontend.route('/index')
def index():
    context = {
        'debug': settings.DEBUG
    }
    return render_template('index.html', **context)


@frontend.route('/me')
def me():
    res = ajax_response()

    user_dict = current_user.to_dict() if current_user.is_authenticated() else {}
    user_dict.update(self_home=False)

    res.update(data={
        'user': user_dict
    })
    return jsonify(res)

@frontend.route('/<username>')
def user_home(username):
    res = ajax_response()

    with session_cm() as db:
        owner = db.query(User).filter_by(username=username).first()
        if owner:
            print "set owner to g: ", owner.email
            res.update(data={
                'owner': owner.to_dict()
            })
            session["owner_id"] = owner.user_id
            return jsonify(res)
        else:
            abort(404)