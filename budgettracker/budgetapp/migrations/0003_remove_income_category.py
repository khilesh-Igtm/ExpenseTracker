# Generated by Django 5.1.2 on 2025-05-02 17:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('budgetapp', '0002_remove_budget_month_alter_budget_user_expense_income_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='income',
            name='category',
        ),
    ]
