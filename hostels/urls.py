from django.urls import path

from .views import (
    HostelListCreateView,
    HostelDetailView,
)


urlpatterns = [
    path(
        '',
        HostelListCreateView.as_view(),
        name='hostel-list-create'
    ),

    path(
        '<int:pk>/',
        HostelDetailView.as_view(),
        name='hostel-detail'
    ),
]