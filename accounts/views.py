from django.shortcuts import render

# Create your views here.

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import SignupSerializer
from rest_framework.views import APIView




class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

    def put(self, request):
        user = request.user

        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()

        if not username:
            return Response(
                {"username": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not email:
            return Response(
                {"email": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth import get_user_model
        User = get_user_model()

        if User.objects.filter(username__iexact=username).exclude(
            pk=user.pk
        ).exists():
            return Response(
                {"username": "This username is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.username = username
        user.email = email
        user.save(update_fields=["username", "email"])

        return Response({
            "message": "Profile updated successfully.",
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })
        # chnange Password Opyion
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        current_password = request.data.get("current_password", "")
        new_password = request.data.get("new_password", "")
        confirm_password = request.data.get("confirm_password", "")

        if not current_password or not new_password or not confirm_password:
            return Response(
                {"error": "All password fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(current_password):
            return Response(
                {"current_password": "Your current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {"confirm_password": "The new passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if current_password == new_password:
            return Response(
                {"new_password": "Your new password must differ from your current password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as error:
            return Response(
                {"new_password": list(error.messages)},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "message": "Password changed successfully."
        })
