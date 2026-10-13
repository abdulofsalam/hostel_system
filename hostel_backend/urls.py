"""
URL configuration for hostel_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),

    path(
        'api/auth/',
        include('accounts.urls')
    ),

    path(
        'api/hostels/',
        include('hostels.urls')
    ),

    path(
    'api/rooms/',
    include('rooms.urls')
    ),

    path(
    'api/students/',
    include('students.urls')
    ),
    
    path(
    'api/payments/',
    include('payments.urls')
    ),
]

# room urls is connected at line 34
# Your authentication API is now:

# http://127.0.0.1:8000/api/auth/signup/
# http://127.0.0.1:8000/api/auth/login/
# http://127.0.0.1:8000/api/auth/token/refresh/

# POST   /api/hostels/
# GET    /api/hostels/
# GET    /api/hostels/1/
# PUT    /api/hostels/1/
# PATCH  /api/hostels/1/
# DELETE /api/hostels/1/