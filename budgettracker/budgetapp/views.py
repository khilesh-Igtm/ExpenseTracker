from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Budget, Income, Expense, Category
from .serializers import LoginSerializer, BudgetSerializer, IncomeSerializer, ExpenseSerializer , CategorySerializer
from rest_framework.permissions import IsAuthenticated

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                token, created = Token.objects.get_or_create(user=user)
                response = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
                response.set_cookie(
                    key='auth_token',
                    value=token.key,
                    httponly=True,
                    samesite='None',
                    secure=True  # Set to True in production with HTTPS
                )
                return response
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"authenticated": True})
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Optional: delete token
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass

        # Remove cookie by setting it empty and expired
        response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie('auth_token')
        return response

class CategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CategorySerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def get(self, request):
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class BudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            budget = Budget.objects.get(user=request.user)
            return Response({"amount": budget.amount}, status=status.HTTP_200_OK)
        except Budget.DoesNotExist:
            return Response({"amount": 0}, status=status.HTTP_200_OK)

    def post(self, request):
        amount = request.data.get("amount")
        if amount is None:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        # either update or create
        budget, created = Budget.objects.update_or_create(
            user=request.user,
            defaults={"amount": amount}
        )
        return Response({"amount": budget.amount}, status=status.HTTP_200_OK)


class IncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def get(self, request):
        income = Income.objects.filter(user=request.user).order_by('-id')
        serializer = IncomeSerializer(income, many=True)
        return Response(serializer.data)


class ExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseSerializer(expenses, many=True, context={'request': request})
        return Response(serializer.data)
    
    def delete(self, request, expense_id=None):
        try:
            expense = Expense.objects.get(id=expense_id, user=request.user)
            expense.delete()
            return Response(status=204)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=404)
        
    def put(self, request, expense_id=None):
        try:
            expense = Expense.objects.get(id=expense_id, user=request.user)
            serializer = ExpenseSerializer(expense, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=404)

       
