'''
Created on 2013-4-26

@author: Sarike
'''
from django.contrib import admin
from todos.models import Todo, Achievement


class TodoAdmin(admin.ModelAdmin):
    fields = ['todo_name','todo_description','todo_start','todo_end','todo_visibale','todo_erasable']
    
    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

admin.site.register(Todo,TodoAdmin)
admin.site.register(Achievement)