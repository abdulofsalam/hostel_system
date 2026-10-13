
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    is_owner = models.BooleanField(default=True)

    def __str__(self):
        return self.username

# from django.db import models

# # Create your models here.

# from django.contrib.auth.models import AbstractUser
# from django.db import models


# class User(AbstractUser):
#     email = models.EmailField(unique=True)

#     def __str__(self):
#         return self.username