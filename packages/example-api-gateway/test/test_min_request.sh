#!/bin/bash

echo "%{time_total}s\\n" > curl_format.txt
echo "" > test_min_request.log

end=$((SECONDS+60))

while [ $SECONDS -lt $end ]; do
  for i in {1..10}
  do
    curl -w "@curl_format.txt" -o /dev/null -s "http://localhost:4000/api-gateway/polls\?limit\=25\&after\=0" >> test_min_request.log
    sleep 1
  done
done
