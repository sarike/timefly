from django.db import models
from django.db.models.base import Model
from django.contrib.auth.models import User

# Create your models here.


class Todo(Model):
    user = models.ForeignKey(User)
    
    todo_name = models.CharField(max_length=20)
    todo_description = models.CharField(max_length=100)
    todo_visibale = models.BooleanField(default=True)
    todo_start = models.DateTimeField()
    todo_end = models.DateTimeField()
    todo_add_time = models.DateTimeField()
    todo_is_top = models.BooleanField(default = False)
    todo_erasable = models.BooleanField(default=False)
    todo_is_completed = models.BooleanField(default = False)
    todo_is_deleted = models.BooleanField(default = False)
    def __unicode__(self):
        return self.todo_name
    
class Achievement(Model):
    todo = models.ForeignKey(Todo)
    user = models.ForeignKey(User)
    ac_name = models.CharField(max_length=20)
    ac_description = models.CharField(max_length=100)
    ac_time = models.DateTimeField()
    
    def __unicode__(self):
        return self.ac_name
    
    