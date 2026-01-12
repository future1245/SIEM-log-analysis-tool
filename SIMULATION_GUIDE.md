This is the guide for how to simulate the SIEM analysis and detection tool 

##1.HOW TO SIMULATE AUTH.LOG ANALYSIS :

    ###SSH 
    
    * type , ssh <username>@<ip>
    * you will be prompt to enter the password , if the password is wrong or the password is correct will be detected 

    ###SUDO SU (privilage escalation) 
    
    * type , sudo su 
    * you will be prompt to enter the password , if the password is wrong or the password is correct will be detected

    ###CRON 
        
    * type , crontab -e
    * go to the bottom of the page opened and paste ,   * * * * * echo test1 >> /tmp/cron1.log
                                                        * * * * * echo test2 >> /tmp/cron2.log
                                                        * * * * * echo test3 >> /tmp/cron3.log
                                                        * * * * * echo test4 >> /tmp/cron4.log
                                                        * * * * * echo test5 >> /tmp/cron5.log
                                                        * * * * * echo test6 >> /tmp/cron6.log

    * and save it 
    * the cron activity will be detected 

---

##2.HOW TO SIMULATE EVE.JSON ANALYSIS IN SURICATA :

    ###DETECT UNUSUAL PORT OUTBOUND CONNECTION 

    *type , nc google.com 4444
    *unsual outbound connection will be detected 

    ###EXCESSIVE OUTBOUND CONNECTION 

    *type , for i in {1..12}; do curl -s http://example.com > /dev/null done
    *excessive outbound connection will be detected 

    ###HIGH OUTBOUND DATA

    *type , head -c 150000 /dev/urandom | curl -X POST http://httpbin.org/post --data-binary @-
    *high outbound connection will be detected 

    ###DNS FLOODING 

    *type , for i in {1..30}; do            
            dig google.com > /dev/null
            done
    
    *the dns flooding will be detected 

    ###HTTP FLOODING 

    *type , for i in {1..30}; do curl http://example.com >/dev/null; done

    *the http flooding will be detected 

    ###HTTPS SNI DETECTION

    *type , curl https://google.com
            curl https://github.com
            curl https://openai.com
            curl https://microsoft.com
            curl https://cloudflare.com

    *the multiple https sni request will be detected
    




        






                        