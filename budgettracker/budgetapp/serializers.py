# finance/serializers.py
from rest_framework import serializers
from .models import Category, Budget, Income, Expense

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'amount']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'amount', 'date']

class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.CharField()  # Accept plain text name from frontend

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'date']

    def create(self, validated_data):
        user = self.context['request'].user
        category_name = validated_data.pop('category')

        # Try to get category, else create it
        category, created = Category.objects.get_or_create(
            user=user,
            name=category_name
        )

        expense = Expense.objects.create(
            user=user,
            category=category,
            **validated_data
        )
        return expense
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        category_name = validated_data.pop('category', None)

        if category_name:
            category, created = Category.objects.get_or_create(
                user=user,
                name=category_name
            )
            instance.category = category

        instance.amount = validated_data.get('amount', instance.amount)
        instance.date = validated_data.get('date', instance.date)
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['category'] = instance.category.name  # Show category name, not object
        return data