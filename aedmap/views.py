from django.shortcuts import render, HttpResponse

# Create your views here.

def index(request):
    return render(request, 'aedmap/index.html')

def academics(request):
    return render(request, 'aedmap/academics.html')

def blog(request):
    return render(request, 'aedmap/blog.html')

def contactus(request):
    return render(request, 'aedmap/contact-us.html')
    
def history(request):
    return render(request, 'aedmap/history.html')

def privacypolicy(request):
    return render(request, 'aedmap/privacy-policy.html')

def searchresults(request):
    return render(request, 'aedmap/search-results.html')

def tutors(request):
    return render(request, 'aedmap/tutors.html')
