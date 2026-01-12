###FOR OPENING THE CORNTAB 
```bash 
crontab -e 
```

###PASTE THIS IN THE CRONTAB

```bash 
* * * * * echo test1 >> /tmp/cron1.log
* * * * * echo test2 >> /tmp/cron2.log
* * * * * echo test3 >> /tmp/cron3.log
* * * * * echo test4 >> /tmp/cron4.log
* * * * * echo test5 >> /tmp/cron5.log
* * * * * echo test6 >> /tmp/cron6.log
```