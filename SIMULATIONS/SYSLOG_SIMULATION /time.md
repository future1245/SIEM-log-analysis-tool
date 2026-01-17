## STOP THE TIME SYNC 
```bash 
sudo systemctl stop systemd-timesyncd
```

## CHANGE TIME 
```bash 
sudo date -s "+1 minute"
```

## RESTART THE TIME SYNC 
```bash 
 sudo systemctl start systemd-timesyncd
```
