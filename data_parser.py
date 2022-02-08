# "Sudachi","Mon-Wed 5 pm - 12:30 am  , Thu-Fri 5 pm - 1:30 am  , Sat 3 pm - 1:30 am  , Sun 3 pm - 11:30 pm"
import csv,json
from pickle import FALSE, TRUE

def time_to_number(time,rowNum):
    charArr = ['0','1','2','3','4','5','6','7','8','9',':','a','p','m']
    for x in time:
        found = False
        for y in charArr:
            if(x == y):
                found = TRUE
                break
        if( not found):
            print(rowNum)
            print(time)
            print('Not found in charArr')
            return -1
    timeLen = len(time)
    if(timeLen>7 or timeLen < 3):
        print(rowNum)
        print(time)
        print('Invalid Length')
        return -1
    idx = time.find(':')
    isPm = bool(time.find("pm")!=-1)
    first = 0
    second=0
    if(idx!=-1):
        first = int(time[:idx])
        second = int(time[idx+1:timeLen-2])
    else:
        first = int(time[:timeLen-2])

    if(first == 12):
        if( not isPm):
            first = 0
    
    if(isPm and first !=12 ):
        first = first + 12
    return (first*100 + second)

def get_timing(scheduleStr, rowNum):
    week = ["Mon","Tues","Wed","Thu","Fri","Sat","Sun"]
    dc={"Mon":0,"Tues":1,"Wed":2,"Thu":3,"Fri":4,"Sat":5,"Sun":6}
    scheduleStr=scheduleStr.replace(" ","")
    otime={}
    ctime={}
    sectionArr=list(scheduleStr.split(","))
    for section in sectionArr:
        found=[]
        for day in week:
            if (section.find(day)!=-1):
                if(len(found)!=0):
                    a=section.find(day)
                    b=section.find(found[0])
                
                    if(a<b):
                        found.insert(0,day)
                        continue
                found.append(day)
        lastIdx = len(found)-1
        lastEle = found[lastIdx]
        idx=section.find(lastEle)
        idx+=len(lastEle)
        ot=-1
        ct=-1
        if(idx>=len(section)):
            ot=0
            ct=2359
        else:
            s1 = section[idx:]
            idx=s1.find('-')
            ot = time_to_number(s1[:idx],rowNum)
            ct = time_to_number(s1[idx+1:],rowNum)

        if (len(found)==1):
            otime[found[0]]=ot
            ctime[found[0]]=ct
        elif (len(found)==2):
            for i in range(min(dc[found[0]],dc[found[1]]),max(dc[found[0]],dc[found[1]])+1):
                otime[week[i]]=ot
                ctime[week[i]]=ct
    for day in week:
        if day not in otime:
            otime[day]=-1
            ctime[day]=-1
    timings={}
    for day in week:
        t1={}
        t1["openingTime"]=otime[day]
        t1["closingTime"]=ctime[day]
        timings[day]=t1
    return timings


# data={}
with open('./hours.csv',encoding='utf-8') as csvf:
    csvReader = csv.DictReader(csvf)
    lst=[]
    i=0
    for rowNum,rows in enumerate(csvReader):

        name = rows['restaurantName']
        data={}
        data["restaurantName"] = name
        time = rows['time']
        data['time'] = rows['time']
        data["schedule"] = get_timing(time,rowNum)
        
        lst.append(data)
    with open('./hours2.json','w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(lst, indent=4))