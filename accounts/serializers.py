
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_owner=True,
        )
        return user

# from rest_framework import serializers
# from django.contrib.auth import get_user_model

# User = get_user_model()


# class SignupSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True,
#         min_length=8
#     )

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password']

#     def create(self, validated_data):
#         return User.objects.create_user(**validated_data)