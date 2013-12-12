# coding=utf-8
import re
from flask import Blueprint, render_template, jsonify, redirect
from flask.ext.login import login_user, logout_user, current_user
from flask.ext.wtf.form import Form
from flask.ext.wtf.recaptcha.fields import RecaptchaField
from flask.ext.wtf.recaptcha.validators import Recaptcha
from flask.globals import request
from flask.helpers import url_for
from wtforms.fields.core import BooleanField
from wtforms import TextField, PasswordField, validators
from models.user import User
from utils.db_utils.database_session import session_cm
from utils.response import ajax_response

account = Blueprint('views', __name__, template_folder='templates')


@account.route('/passionate_users')
def passionate_users():
    res = ajax_response()
    with session_cm() as session:
        user_list = session.query(User).all()
        user_dict_list = []
        for user in user_list:
            user_dict_list.append(user.to_dict())
        res.update(data={
            "items": user_dict_list
        })
    return jsonify(res)

@account.route('/my_friends')
def my_friends():
    res = ajax_response()
    with session_cm() as session:
        user_list = session.query(User).all()
        user_dict_list = []
        for user in user_list:
            user_dict_list.append(user.to_dict())
        res.update(data={
            "items": user_dict_list
        })
    return jsonify(res)


@account.route('/reset_password', methods=['POST'])
def reset_password():
    res = ajax_response()
    old_password = request.form.get('old_password')
    new_password = request.form.get('new_password')
    new_password_confirm = request.form.get('new_password_confirm')
    if new_password and new_password_confirm and new_password_confirm != new_password:
        res.update({
            'info': '两次输入的新密码不一致',
            'type': 'error'
        })
        return jsonify(res)
    if not current_user.check_password(old_password):
        res.update({
            'info': '原始密码错误',
            'type': 'error'
        })
        return jsonify(res)
    with session_cm() as session:
        session.query(User).get(current_user.user_id).set_password(new_password)
        session.commit()
    res.update(info='密码修改成功')
    return jsonify(res)


@account.route('/update_profile', methods=['POST'])
def update_profile():
    res = ajax_response()
    desc = request.form.get('desc')
    with session_cm() as session:
        user = session.query(User).get(current_user.user_id)
        user.description = desc
        res['info'] = '更新用户资料成功'
        session.commit()
    return jsonify(res)


@account.route('/ajax_login', methods=['POST'])
def ajax_login():
    res = ajax_response()
    email = request.form.get("email")
    password = request.form.get("password")
    remember = True if request.form.get("remember") else False
    if not email or not password:
        res.update({
            'response': 'fail',
            'type': 'error',
            'info': '邮箱不能为空' if not email else '密码不能为空'
        })
        return jsonify(res)

    user, validate_user_errors = User.validate_user(email, password)
    if user:
        login_user(user, remember)

        user_dict = user.to_dict()
        user_dict.update(self_home=False)

        res.update(data={
            'user': user_dict
        })
    else:
        res.update({
            'response': 'fail',
            'type': 'error',
            'info': validate_user_errors['user_error'] or validate_user_errors['password_error']
        })
    return jsonify(res)



@account.route('/login', methods=['POST'])
def login():
    template_var = {}
    validate_user_errors = None
    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        remember = form.remember.data
        user, validate_user_errors = User.validate_user(email, password)
        if user is not None:
            login_user(user, remember)
            template_var['owner'] = user
            return render_template('index.html', **template_var)
    template_var.update({
        'form': form,
        'validate_user_errors': validate_user_errors
    })
    return render_template("account/login.html", **template_var)


@account.route('/reg', methods=['GET', 'POST'])
def register():
    """
    注册一个新的用户
    """
    template_var = {}
    form = RegisterForm()
    if request.method == "POST" and form.validate():
        form = RegisterForm(request.form)
        with session_cm() as session:
            user = User()
            user.username = form.username.data
            user.nickname = form.nickname.data
            user.email = form.email.data
            user.set_password(form.password.data)
            session.add(user)
            if user is not None:
                login_user(user)
            session.commit()
            return redirect(url_for('frontend.index'))
    template_var['form'] = form
    return render_template('account/register.html', **template_var)

@account.route('/logout')
def logout():
    """
    注销用户
    """
    logout_user()
    return redirect(url_for('frontend.index'))


class LoginForm(Form):
    email = TextField(u'邮箱', [validators.Required(message=u"登录邮箱不能为空")])
    password = PasswordField(u'密码', [validators.Required(message=u"密码不能为空")])
    remember = BooleanField(u'记住密码')


class RegisterForm(Form):

    email = TextField(u'邮箱', [validators.Required(message=u"邮箱不能为空")])
    username = TextField(u'用户名',
                         [validators.Required(message=u"用户名不能为空")])
    nickname = TextField(u'昵称',
                         [validators.Required(message=u"每个响亮的昵称怎么混？"),
                          validators.length(max=4, message=u'要有咱也不能太长呀，最长4个字符')])
    password = PasswordField(u'密码',
                             [validators.Required(message=u"密码不能为空"),
                              validators.length(max=16, message=u'要有咱也不能太长呀，最长16个字符')])
    password_confirm = PasswordField(u'密码确认',
                                     [validators.Required(message=u"请再次输入密码"),
                                      validators.equal_to('password', message=u'两次输入的密码必须要一致')])
    recaptcha = RecaptchaField(u'验证码', [Recaptcha(message=u'验证码不正确')])

    def validate_email(self, field):
        with session_cm() as session:
            if session.query(User).filter(User.email == field.data).first():
                raise ValueError(u"该邮箱已经存在")

    def validate_username(self, field):
        with session_cm() as session:
            pattern = re.compile(r'^\w{6,16}$')
            if pattern.match(field.data) is None:
                raise ValueError(u"用户名只能由字母、下划线、数字组成，且字符数在(6-16)之间")
            if session.query(User).filter(User.username == field.data).first():
                raise ValueError(u"该用户名已经存在")