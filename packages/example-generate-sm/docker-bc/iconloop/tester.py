#!/usr/bin/env python3

import time
import subprocess
import re
import os
import json

from faker import Faker

fake = Faker()

def tbears(args):
  cmd = 'tbears ' + args
  print('execute command:', cmd)

  out = cmd
  proc = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, cwd="/work")
  out = proc.stdout.decode('utf-8')

  return out


def deploy_hello():
  out = tbears('deploy ./smart-contract/icon_hello -k ./keystore_test1 -p "test1_Account"')
  searchObj = re.search(r'0x\w+', out, re.M)
  return searchObj.group()


def txresult(tx):
  time.sleep(2)
  out = tbears('txresult ' + tx)
  out = out.replace('Transaction : ', '')
  return json.loads(out)


def sendTrx(ID, name):
  print(f'---- {name}: {ID}')
  return tbears('call ./smart-contract/icon_hello/' + name + '.json')

fp = '../smart-contract/icon_hello'


def crePoll(to):
  name = 'crePoll'

  # update crt json
  fd = open(f'{fp}/{name}.json', 'r')
  obj = json.loads(fd.read())
  fd.close()
  
  obj['params']['to'] = to

  for id in range(100):
    ID = id + 1
    obj['params']['data']['params']['id'] = ID
    obj['params']['data']['params']['name'] = f'{ID} -- {fake.name()}'
    obj['params']['data']['params']['body'] = f'{ID} -- {fake.text()}'
    outText = json.dumps(obj)

    tmpOut = f'_{name}'
    fw = open(f'{fp}/{tmpOut}.json', 'w')
    fw.write(outText)
    fw.close()
    
    # exec command
    sendTrx(ID, tmpOut)
  

def creVote(to):
  name = 'creVote'
  # update crt json
  fd = open(f'{fp}/{name}.json', 'r')
  obj = json.loads(fd.read())
  fd.close()
  
  obj['params']['to'] = to

  ID = 0
  for id in range(50):
    pollId = id + 1
    numOfVote = fake.random_number(digits=1, fix_len=True) + 10

    for id in range(numOfVote):
      ID = ID + 1
      obj['params']['data']['params']['id'] = ID
      obj['params']['data']['params']['pollId'] = pollId
      obj['params']['data']['params']['ownerId'] = ID
      obj['params']['data']['params']['point'] = fake.random_number(digits=3, fix_len=True)
      outText = json.dumps(obj)

      tmpOut = f'_{name}'
      fw = open(f'{fp}/{tmpOut}.json', 'w')
      fw.write(outText)
      fw.close()
      
      # exec command
      sendTrx(ID, tmpOut)


def delPoll(to):
  name = 'delPoll'
  # update crt json
  fd = open(f'{fp}/{name}.json', 'r')
  obj = json.loads(fd.read())
  fd.close()
  
  obj['params']['to'] = to

  for id in range(70,80):
    ID = id + 1
    obj['params']['data']['params']['id'] = ID
    outText = json.dumps(obj)

    tmpOut = f'_{name}'
    fw = open(f'{fp}/{tmpOut}.json', 'w')
    fw.write(outText)
    fw.close()
    
    # exec command
    sendTrx(ID, tmpOut)
  

def test():
  # deploy smart contract
  dtx = deploy_hello()
  cx = txresult(dtx)
  to = cx['result']['scoreAddress']
  
  crePoll(to)
  creVote(to)
  delPoll(to)

test()
