from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates mock users for testing'

    def handle(self, *args, **kwargs):
        users = [
            {'username': 'user1', 'password': 'password123'},
            {'username': 'user2', 'password': 'password123'},
        ]
        for user_data in users:
            if not User.objects.filter(username=user_data['username']).exists():
                User.objects.create_user(
                    username=user_data['username'],
                    password=user_data['password']
                )
                self.stdout.write(self.style.SUCCESS(f"Created user: {user_data['username']}"))
            else:
                self.stdout.write(self.style.WARNING(f"User {user_data['username']} already exists"))