#coding:utf-8
# Create your views here.
from accounts.models import UserProfile
from django import forms
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.forms.widgets import Textarea
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from todos.models import Todo, Achievement
import datetime
import logging

logger = logging.getLogger("timefly.custom")

def SiteIndex(req):
    user_list = User.objects.all()
    todo_list = Todo.objects.filter(todo_visibale = True)
    context = {'user_list':user_list,'todo_list':todo_list,'position':'index','todo_form':TodoForm()}
    return render(req,'index.html',context)

def HomeView(req,username):
    todo_form = TodoForm()
    ac_form = AchievementForm()
    owner = get_object_or_404(User,username=username)
    status = req.GET.get("status") if req.GET.get("status") is not None else "ing"
    if status == "ing":
        todo_list = Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_completed = False) \
                                .filter(todo_end__gte = datetime.date.today())\
                                .filter(todo_is_deleted = False)
        if owner.username != req.user.username:
            todo_list = todo_list.filter(todo_visibale = True)
    if status == "ed":
        todo_list = Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_deleted = False)\
                                .filter(todo_is_completed = True)
        if owner.username != req.user.username:
            todo_list = todo_list.filter(todo_visibale = True)
    if status == "fail":
        todo_list = Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_deleted = False)\
                                .filter(todo_is_completed = False) \
                                .filter(todo_end__lte = datetime.date.today().replace(day = datetime.date.today().day - 1))
        if owner.username != req.user.username:
            todo_list = todo_list.filter(todo_visibale = True)
            
            
    ing_count = Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_completed = False) \
                                .filter(todo_end__gte = datetime.date.today())\
                                .filter(todo_is_deleted = False).count() \
                                if owner.username == req.user.username else \
                                Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_completed = False) \
                                .filter(todo_end__gte = datetime.date.today())\
                                .filter(todo_is_deleted = False).filter(todo_visibale = True).count()
    ed_count = Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_deleted = False)\
                                .filter(todo_is_completed = True).count()\
                                if owner.username == req.user.username else \
                                Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_deleted = False)\
                                .filter(todo_is_completed = True).filter(todo_visibale = True).count()
                                
    fail_count = Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_deleted = False)\
                                .filter(todo_is_completed = False) \
                                .filter(todo_end__lte = datetime.date.today().replace(day = datetime.date.today().day - 1)).count()\
                                if owner.username == req.user.username else \
                                Todo.objects.filter(user__username__exact=username) \
                                .filter(todo_is_deleted = False)\
                                .filter(todo_is_completed = False) \
                                .filter(todo_end__lte = datetime.date.today().replace(day = datetime.date.today().day - 1)).filter(todo_visibale = True).count()
    context = {'todo_list':todo_list,
               'owner':owner,
               'todo_form':todo_form,
               'ac_form':ac_form,
               'status':status,
               'ing_count':ing_count,
               'ed_count':ed_count,
               'fail_count':fail_count}
    return render(req,'home.html',context)

def AddTodoView(req):
    logger.info("add_todo view....")
    if req.method == "POST" and req.user.is_authenticated():
        form = TodoForm(req.POST)
        if form.is_valid():
            Todo.objects.create(user=req.user,
                                todo_add_time = timezone.now(),
                                todo_name=form.cleaned_data['todo_name'],
                                todo_description=form.cleaned_data['todo_description'],
                                todo_start = form.cleaned_data['todo_start'],
                                todo_end = form.cleaned_data['todo_end'],
                                todo_visibale = form.cleaned_data['todo_visibale'],
                                todo_erasable = form.cleaned_data['todo_erasable']).save()
            req.user.userprofile.todo_count += 1
            req.user.userprofile.save()
        
    return HttpResponseRedirect(reverse("todos:todos-home",kwargs={'username': req.user.username})) 

def AddAcView(req):
    if req.method == "POST" and req.user.is_authenticated():
        form = AchievementForm(req.POST)
        if form.is_valid():
            Achievement.objects.create(user = req.user,
                                       todo = Todo.objects.get(pk=req.POST['todoid']),
                                       ac_time = timezone.now(),
                                       ac_name = form.cleaned_data['ac_name'],
                                       ac_description = form.cleaned_data['ac_description']).save()
    return HttpResponseRedirect(reverse("todos:todos-home",kwargs={'username': req.user.username})) 

@login_required
def Setting(req,tabname):
    todo_form = TodoForm()
    user_form = UserForm(instance = req.user)
    if tabname == 'userinfo':
        if req.method == "POST":
            user_form = UserForm(req.POST, instance = req.user)
            form = UserInfoForm(req.POST, instance = req.user.userprofile)
            logger.info("username:%s",req.user.username)
            if user_form.is_valid() and form.is_valid():
                logger.info("user_form and user_info_form is valided!")
                user_form = UserForm(instance = user_form.save())
                form = UserInfoForm(instance = form.save())
                messages.add_message(req, messages.INFO, u'更新成功','success')
            else:
                logger.info("user_form errors:%s", user_form.errors)
                logger.info("user_info_form errors:%s", form.errors)
        else:
            try:
                form = UserInfoForm(instance = req.user.userprofile)
            except UserProfile.DoesNotExist:
                UserProfile.objects.create(user=req.user)
                form = UserInfoForm(instance = req.user.userprofile)
                
    if tabname == 'alterpwd':
        if req.method == "POST":
            form = ChangePasswordForm(req.POST)
            if form.is_valid():
                old_password = form.cleaned_data['old_password']
                if req.user.check_password(old_password):
                    req.user.set_password(form.cleaned_data['new_password'])
                    req.user.save()
                    messages.add_message(req, messages.INFO, u'密码修改成功','success')
                else:
                    messages.add_message(req, messages.ERROR, u'密码不正确','error')
            else:
                logger.info("password change errors: %s", form.errors)
        else:
            form = ChangePasswordForm()
    context = {'tabname':tabname,'todo_form':todo_form,'user_form':user_form, 'form':form}
    return render(req,"settings.html",context)

class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = ('todo_name','todo_start','todo_end','todo_description','todo_visibale','todo_erasable')
        widgets = {
            'todo_description': Textarea(attrs={'rows': 5}),
        }
class AchievementForm(forms.ModelForm):
    class Meta:
        model = Achievement
        fields = ('ac_name','ac_description')
        widgets = {
            'ac_description': Textarea(attrs={'rows': 5}),
        }
class UserForm(forms.ModelForm):
    first_name = forms.CharField(required = False,max_length=4)
    email = forms.EmailField(required = True) 
    class Meta():
        model = User
        fields = ('username','email','first_name')
        
    
class UserInfoForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('description',)
        widgets = {
            'description': Textarea(attrs={'rows': 5}),
        }
class EmailRemindForm(forms.ModelForm):
    class Meta:
        model = UserProfile
    
        
class ChangePasswordForm(forms.Form):
    old_password=forms.CharField(max_length=30,widget=forms.PasswordInput(attrs={'size':30}))
    new_password=forms.CharField(max_length=30,widget=forms.PasswordInput(attrs={'size':30}))
    new_password_confirm=forms.CharField(max_length=30,widget=forms.PasswordInput(attrs={'size':30}))
    
    def clean(self):
        cleaned_data = super(ChangePasswordForm, self).clean()
        new_password = cleaned_data.get('new_password')
        new_password_confirm = cleaned_data.get('new_password_confirm')
        if new_password and new_password_confirm and new_password != new_password_confirm:
            msg = u"两次输入的密码不一致"
            self._errors["new_password"] = self.error_class([msg])
            self._errors["new_password_confirm"] = self.error_class([msg])

            # These fields are no longer valid. Remove them from the
            # cleaned data.
            del cleaned_data["new_password_confirm"]
            del cleaned_data["new_password"]
            
        return cleaned_data