###
# https://www.icondev.io/docs/tbears-installation#setup-on-linux
# install `tbears` command
###
FROM python:3.7.3-slim-stretch

RUN apt-get update
RUN apt-get install -y --no-install-recommends\
 gcc\
 libc-dev\
 pkg-config

RUN rm -rf /var/lib/apt/lists/*

RUN pip3 install virtualenv

RUN virtualenv -p python3 venv\
  && chmod +x ./venv/bin/activate\
  && ./venv/bin/activate\
  && pip3 install tbears

WORKDIR /app

VOLUME ["/app"]

ENTRYPOINT [ "tbears" ]
