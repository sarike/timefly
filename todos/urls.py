'''
Created on 2013-4-26

@author: Sarike
'''
from django.conf.urls import patterns, url
from todos import views

urlpatterns = patterns('',
    url(r'^$', views.SiteIndex, name="site-index"),
    url(r'^AddTodo/$', views.AddTodoView),
    url(r'^AddAc/$', views.AddAcView),
    url(r'^Setting/(?P<tabname>\w+)/$', views.Setting),
    url(r'^(?P<username>\w+)/?$', views.HomeView, name="todos-home"),
)