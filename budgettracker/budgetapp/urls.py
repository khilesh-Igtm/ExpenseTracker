from django.urls import path

from .views import LoginView, CategoryView, BudgetView, IncomeView, ExpenseView, AuthCheckView, LogoutView


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('auth-check/', AuthCheckView.as_view(), name='auth-check'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('category/', CategoryView.as_view(), name='category'),
    path('budget/', BudgetView.as_view(), name='budget'),
    path('income/', IncomeView.as_view(), name='income'),
    path('expenses/', ExpenseView.as_view(), name='expenses'),
    path('expenses/<int:expense_id>/', ExpenseView.as_view(), name='delete-expense'),
]