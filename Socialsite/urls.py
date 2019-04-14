"""Socialsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from Meetup import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^home', views.home, name='home'),
    url(r'^Signup', views.Signup, name='Signup'),
    url(r'^Login',views.Login,name='Login'),
    url(r'^uploadvid', views.uploadvid, name='uploadvid'),
    url(r'^timeline',views.timeline,name='timeline'),
    url(r'^profile',views.profile, name='profile'),
    url(r'^SendRequest',views.SendRequest,name='SendRequest'),
    url(r'^Accept',views.Accept,name='Accept'),
    url(r'^Reject',views.Reject,name='Reject'),
    url(r'^savepost',views.savepost,name='savepost'),
    url(r'^uploadpic', views.uploadpic, name='uploadpic'),
    url(r'^mailexp', views.mailexp, name='mailexp'),
    url(r'^videos', views.videos, name='videos'),
    url(r'^Photos', views.Photos, name='Photos'),
    url(r'^p_recover', views.p_recover, name='p_recover'),
    url(r'^Send_pwd', views.Send_pwd, name='Send_pwd'),
    url(r'^Happy', views.Happy, name='Happy'),
    url(r'^picchange', views.picchange, name='picchange'),
    url(r'^coverchange', views.coverchange, name='coverchange'),
    url(r'^OurTeam', views.OurTeam, name='OurTeam'),
    url(r'^logout', views.logout, name='logout'),
    url(r'^abt', views.abt, name='abt'),

]

urlpatterns += staticfiles_urlpatterns()
