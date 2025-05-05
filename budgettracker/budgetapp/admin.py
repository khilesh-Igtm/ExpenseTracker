# Register your models here.
from django.contrib import admin
from .models import Budget, Category, Income, Expense

admin.site.register(Budget)
admin.site.register(Category)
admin.site.register(Income)
admin.site.register(Expense)
