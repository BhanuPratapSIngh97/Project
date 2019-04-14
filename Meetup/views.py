from django.shortcuts import render

# Create your views here.

from django.shortcuts import render,redirect
from django.http import HttpResponse
from Meetup.models import User
from Meetup.models import Friend
from Meetup.models import Wpost
from Meetup.models import Photo
from Meetup.models import Message
from Meetup.models import Likes
from Meetup.models import Video
from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
import random
import re
# Create your views here.request,"login.html")
def logout(request):
    del request.session["email"]
    return render(request,"home.html")

def home(request):
    return render(request,"home.html",{"error": " ","msg": " "})

def Signup(request):
    u=User()
    nwd=""
    nwd=nwd+("ppic/190328/prof_7fA1ECy.png")
    cov=""
    covv=cov+("cover/cover.jpg")
    u.cover=covv
    u.ppic=nwd
    u.status=0
    u.first=request.POST.get("First Name")
    u.last=request.POST.get("Last Name")
    e1=request.POST.get("email")
    e2=request.POST.get("Confirm")
    if e1==e2:
        u.email=request.POST.get("email")
    else:
        return render(request,"home.html",{"msg1":"you entered different email id","msg11":"pleasw try again" })
    p1=request.POST.get("Password")
    p2=request.POST.get("conpwd")
    if p1==p2:
        u.pwd=request.POST.get("Password")
    else:
        return render(request,"home.html",{"msg2":"you entered different Password","msg11":"pleasw try again"})
    u.Mobile=request.POST.get("Number")
    u.gender=request.POST.get("gender")
    u.month=request.POST.get("DOBmonth")
    u.day=request.POST.get("DOBday")
    u.year=request.POST.get("DOByear")
    u.save()
    return render(request,"home.html",{"msg3":"{ Congratulations_! You have Sucsessfully SignUp }"})


def Login(request):
    user = User.objects.filter(email=request.GET.get("email"),pwd=request.GET.get("pwd"))
    if user.exists()==True:
        request.session["email"]=request.GET.get("email")
        res=redirect("timeline")
        return res
    else:
    	return render (request,"home.html",{"error":"you entered wrong id or password"})



def timeline(request):
    friends=Friend.objects.filter(rec=request.session.get("email"),status=0)
    f=Friend.objects.filter(Q(sender=request.session.get("email"))| Q(rec=request.session.get("email")), status=1)
    u=User.objects.filter(Q(email=request.session.get("email")))
    myfriends=Getfriends(request.session.get("email"))
    myfriend=Getmails(request.session.get("email"))
    allfriends=myfriends.copy()
    allfriends.append(request.session.get("email"))
    myposts=[]
    for ff in u:
        myposts=Wpost.objects.all()
    ppic=User.objects.filter(email=request.session.get("email"))
    return render(request,"timeline.html",{"myposts":myposts[::-1],"rlist":friends,"ppic":ppic,"myfriends":myfriends[::-1],"myfriend":myfriend[::-1]})


def SendRequest(request):
    f=Friend()
    f.sender=request.session.get("email")
    f.rec=request.GET.get("rec")
    f.status=0
    f.save()
    res =redirect("timeline")
    return res

def Accept(request):
    f=Friend.objects.get(id=request.GET.get("id"))
    f.status=1
    f.save()
    res = redirect("timeline")
    return res
def Reject(request):
    f=Friend.objects.get(id=request.GET.get("id"))
    f.status=2
    f.save()
    res = redirect("timeline")
    return res

def Getfriends(uid):
    f=Friend.objects.filter(Q(sender=uid)| Q(rec=uid), status=1)
    friends=[]
    for ff in f:
        if ff.sender==uid:
            friends.append(ff.rec)
        else:
            friends.append(ff.sender)
    names = []
    for fff in friends:
        u = User.objects.get(email=fff)
        names.append(u.first)
    return names


def Getmails(uid):
    f=Friend.objects.filter(Q(sender=uid)| Q(rec=uid), status=1)
    friends=[]
    for ff in f:
        if ff.sender==uid:
            friends.append(ff.rec)
        else:
            friends.append(ff.sender)
    pphoto=[]
    for ff in friends:
        p = User.objects.get(email=ff)
        pphoto.append(p.ppic)
    return pphoto


def Getlist(uid):
    f=Friend.objects.filter(Q(sender=uid)| Q(rec=uid), status=1)
    friends=[]
    for ff in f:
        if ff.sender==uid:
            friends.append(ff.rec)
        else:
            friends.append(ff.sender)
    return friends

def savepost(request):
        if request.method == 'POST':
            abusiveWords = ['hell' , 'adult' , 'stupid']
            u=User.objects.get(email=request.session.get("email"))
            if u.status ==3:
                return redirect("timeline")
            else:
                upic=u.ppic
                sender=u.first+"_"+u.last
                msg = request.POST.get('msg')
                for i in abusiveWords:
                    if re.findall(r"\b" + i + r"\b", msg):
                        msg=msg.replace( i ,'*'*len(i))
                        u.status = u.status+1
                        u.save()
                    else:
                        msg=msg
                wpic = request.FILES.get('myfile')
                wvid = request.FILES.get('video')
                time = request.POST.get('time')
                wpost_obj = Wpost(wpic=wpic, msg=msg, sender=sender, wvid=wvid, upic=upic, time=time).save()
                return redirect("timeline")

def picchange(request):
	u=User.objects.get(email=request.session.get("email"))  
	if request.method == 'POST':
		pic=request.FILES.get('myfile')		
		u.ppic=pic
		u.save()
		return redirect("profile")

def coverchange(request):
    u=User.objects.get(email=request.session.get("email"))  
    if request.method == 'POST':
        pic=request.FILES.get('myfile')     
        u.cover=pic
        u.save()
        return redirect("profile")

def uploadpic(request):
	p=Photo()
	p.email=request.session.get("email")
	if request.method == 'POST':
		pic=request.FILES.get('myfile')
		p.photos=pic
	p.save()
	return redirect("Photos")

def Photos(request):
    subfriend=Getmails(request.session.get("email"))
    pics=Photo.objects.filter(email=request.session.get("email"))
    ppic=User.objects.filter(email=request.session.get("email"))
    return render(request,"Photos.html",{"pro":pics, "ppic":ppic, "pphoto":subfriend,})

def uploadvid(request):
	v=Video()
	v.email=request.session.get("email")
	if request.method == 'POST':
		video=request.FILES.get("video")
		v.videofile=video
	v.save()
	return redirect("videos")

def videos(request):
    myvideo=Video.objects.filter(email=request.session.get("email"))
    ppic=User.objects.filter(email=request.session.get("email"))
    return render(request,"videos.html",{"myvideo":myvideo, "ppic":ppic})

def Send_pwd(request):
    u=User.objects.get(email=request.GET.get("email"))
    nwd=""
    for i in range(1,7):
        nwd=nwd+chr(random.randint(65,91))
    u.pwd=nwd
    to_user=request.GET.get("Email")
    mail_subject='PASSWORD RECOVERY'
    mail_message='Your Recovery Password is -->'+nwd
    from_email= settings.EMAIL_HOST_USER
    to_list=[to_user]
    send_mail(mail_subject,mail_message,from_email,to_list)
    u.save()
    res=redirect("home")
    return res

def p_recover(request):
    return render(request,"p_recover.html")

def mailexp(request):
    m = Message()
    m.msg = request.GET.get("msg")
    m.send_to = request.session.get("email")
    m.save()
    pwd=""
    pwd=request.GET.get("msg")
    to_user=request.GET.get("send_to")
    mail_subject='Check Mail'
    mail_message=pwd
    from_email= settings.EMAIL_HOST_USER
    to_list=[to_user]
    send_mail(mail_subject,mail_message,from_email,to_list)
    return HttpResponse('Message Sent')

def Happy(request):
	h=Likes()
	h.email=request.session.get("email")
	h.like=1
	h.save()
	res=redirect("Welcome")
	return res
def abt(request):
    return render(request,"abt.html")

def OurTeam(request):
    return render(request,"OurTeam.html")

def profile(request):
    ppic=User.objects.filter(email=request.session.get("email"))
    cover=User.objects.filter(email=request.session.get("email"))
    u=User.objects.filter(Q(email=request.session.get("email")))
    myfriends=Getfriends(request.session.get("email"))
    subfriend=Getmails(request.session.get("email"))
    pics=Photo.objects.filter(email=request.session.get("email"))
    myvideo=Video.objects.filter(email=request.session.get("email"))

    myposts=[]
    for ff in u:
        myposts=Wpost.objects.all()

    return render(request,"profile.html",{"ppic":ppic,"cover":cover, "pro":pics, "myvideo":myvideo, "myfriends":myfriends[::-1], "myposts":myposts[::-1] , "pphoto":subfriend})
