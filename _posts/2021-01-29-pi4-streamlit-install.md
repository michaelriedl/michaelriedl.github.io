---
layout: blogpost
title: "Installing Streamlit on RPi4"
date: 2021-01-29
tags: programming
description: "How to install Streamlit on RPi4 with Ubuntu 20.04.2 LTS 64bit."
---

I recently got a Raspberry Pi 4 and the first project I want to use it for is scraping stock data. In addition, I want the Pi to run a web-based dashboard in the background so that I can monitor the scraping and data quality. I have some familiarity with Streamlit, which is a Python package that allows you to build data science web-based dashboards using Python, so I figure I should try to get that running on the Pi. Just trying to run a pip install failed.
```
pip install streamlit
...
-- Running cmake for pyarrow
cmake -DPYTHON_EXECUTABLE=/home/ubuntu/.virtualenvs/stonks/bin/python -DPython3_EXECUTABLE=/home/ubuntu/.virtualenvs/stonks/bin/python  -DPYARROW_BUILD_CUDA=off -DPYARROW_BUILD_FLIGHT=off -DPYARROW_BUILD_GANDIVA=off -DPYARROW_BUILD_DATASET=off -DPYARROW_BUILD_ORC=off -DPYARROW_BUILD_PARQUET=off -DPYARROW_BUILD_PLASMA=off -DPYARROW_BUILD_S3=off -DPYARROW_BUILD_HDFS=off -DPYARROW_USE_TENSORFLOW=off -DPYARROW_BUNDLE_ARROW_CPP=off -DPYARROW_BUNDLE_BOOST=off -DPYARROW_GENERATE_COVERAGE=off -DPYARROW_BOOST_USE_SHARED=on -DPYARROW_PARQUET_USE_SHARED=on -DCMAKE_BUILD_TYPE=release /tmp/pip-install-b8ahqkyq/pyarrow_c59a8f53d01b46b58561b671c0a23307
error: command 'cmake' failed with exit status 1
----------------------------------------
ERROR: Failed building wheel for pyarrow
Failed to build pyarrow
ERROR: Could not build wheels for pyarrow which use PEP 517 and cannot be installed directly
```
This is a pretty easy error to debug. The issue is that I do not currently have cmake installed. This is easily remedied by running:
```
sudo apt install cmake
```
Trying to run a pip install fails again this time with a more cryptic error.
```
pip install streamlit
...
-- Could NOT find PkgConfig (missing: PKG_CONFIG_EXECUTABLE)
-- Could NOT find Arrow (missing: Arrow_DIR)
CMake Error at /usr/share/cmake-3.16/Modules/FindPackageHandleStandardArgs.cmake:146 (message):
  Could NOT find Arrow (missing: ARROW_INCLUDE_DIR ARROW_LIB_DIR
  ARROW_FULL_SO_VERSION ARROW_SO_VERSION)
Call Stack (most recent call first):
  /usr/share/cmake-3.16/Modules/FindPackageHandleStandardArgs.cmake:393 (_FPHSA_FAILURE_MESSAGE)
  cmake_modules/FindArrow.cmake:419 (find_package_handle_standard_args)
  cmake_modules/FindArrowPython.cmake:46 (find_package)
  CMakeLists.txt:214 (find_package)


-- Configuring incomplete, errors occurred!
See also "/tmp/pip-install-ukwvzvq3/pyarrow_e3f093a86d3542b987b698c48bfa3ebe/build/temp.linux-aarch64-3.8/CMakeFiles/CMakeOutput.log".
error: command 'cmake' failed with exit status 1
----------------------------------------
ERROR: Failed building wheel for pyarrow
Failed to build pyarrow
ERROR: Could not build wheels for pyarrow which use PEP 517 and cannot be installed directly

```

After some searching I came across this discussion on the Streamlit site <a href="https://discuss.streamlit.io/t/raspberry-pi-streamlit/2900/35" target="_blank">https://discuss.streamlit.io/t/raspberry-pi-streamlit/2900/35</a>. Some people solved it by switching to Archiconda but I want to stick with using virtualenvs. One of the suggestions in the post I got to work but needs some modification. Running the following finally works:
```
wget https://apache.bintray.com/arrow/ubuntu/apache-arrow-archive-keyring-latest-focal.deb

sudo apt install ./apache-arrow-archive-keyring-latest-focal.deb

sudo apt update

sudo apt install libarrow-dev libarrow-python-dev

ARROW_HOME=/usr PYARROW_CMAKE_OPTIONS="-DARROW_ARMV8_ARCH=armv8-a" pip install streamlit
```

After completing the install I can run the included Streamlit demo:
```
streamlit hello
```

Hopefully this helps someone else who gets stuck!
