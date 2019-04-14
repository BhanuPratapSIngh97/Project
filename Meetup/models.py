from django.db import models


# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=100,primary_key=True)
    first = models.CharField(max_length=20, null= True)
    last = models.CharField(max_length=20, null=True)
    pwd = models.CharField(max_length=20)
    gender = models.CharField(max_length=10)
    month = models.CharField(max_length=15, null=True)
    day = models.IntegerField(null=True)
    year = models.IntegerField(null=True)
    Mobile = models.IntegerField(null=True)
    status=models.IntegerField(null=True)
    ppic=models.ImageField(upload_to='ppic/%y%m%d')
    cover=models.ImageField(upload_to='cover', blank=True,null=True)

class Friend(models.Model):
    id=models.AutoField(primary_key=True)
    sender=models.CharField(max_length=100)
    rec=models.CharField(max_length=100)
    status=models.IntegerField()

class Wpost(models.Model):
    id=models.AutoField(primary_key=True)
    sender=models.CharField(max_length=100)
    msg=models.CharField(max_length=500, blank=True, null=True)
    wpic = models.ImageField(upload_to='wpic/%y%m%d', blank=True, null=True)
    wvid = models.FileField(upload_to='videos/', null=True, verbose_name="")
    upic = models.FileField(upload_to='upic', null=True)
    likes = models.IntegerField(null=True, blank=True)
    time = models.CharField(max_length=100, null=True)

    
    
class Photo(models.Model):
    email=models.CharField(max_length=100)
    photos=models.ImageField(upload_to='profile_pic/%y%m%d', null=True)

class Message(models.Model):
    msg = models.CharField(max_length=500)
    send_to = models.CharField(max_length=100)


class Video(models.Model):
    email=models.CharField(max_length=100)
    videofile= models.FileField(upload_to='videos/',  verbose_name="")

class Likes(models.Model):
    id=models.IntegerField(primary_key=True)
    email=models.CharField(max_length=100)
    like=models.IntegerField()