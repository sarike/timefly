#coding:utf-8
'''
Created on 2013-5-20

@author: Sarike
'''
from django.contrib import messages
from django.shortcuts import render
from accounts.views import LoginForm
def no_login(req):
    form = LoginForm()
    messages.add_message(req, messages.INFO, u'登陆后才能继续进行操作')
    return render(req,'accounts/login.html',{'form':form})
