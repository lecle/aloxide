#!/bin/bash

echo "%{time_total}s\\n" > curl_format.txt

for i in {1..1000}
do
  curl -w "@curl_format.txt" -o /dev/null -s "http://localhost:4000/api-gateway/polls\?limit\=25\&after\=0" >> test_response_time.log
  sleep 0.001
done
