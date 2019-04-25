---
layout: post
title:  "Prepare your workstation"
permalink: /lessons/prepare-your-workstation/
---

Before starting to code, you will need:

* A test catapult server installed locally.
* The project where we will be working on.
* The command line client.

## Running Catapult Service Bootstrap

You are going to **run a private chain locally** for learning purposes using [Catapult Service Bootstrap](https://github.com/tech-bureau/catapult-service-bootstrap).

1\. Make sure you have [docker](https://docs.docker.com/install/) and [docker compose](https://docs.docker.com/compose/install/) installed before running the following commands:

{% highlight console %}
git clone https://github.com/tech-bureau/catapult-service-bootstrap.git --branch v0.3.0
cd catapult-service-bootstrap
docker-compose up
{% endhighlight %}

2\. After the image has been downloaded and the service is running, check if you can get the first block information:

{% highlight console %}
curl localhost:3000/block/1
{% endhighlight %}

## Downloading the project files
This workshop is project based. You are going to add some new features to an existing project.

1\. Download the workshop repository.

{% highlight console %}
git clone https://github.com/nemtech/nem2-workshop-document-notarization.git
{% endhighlight %}

Under ``project`` folder, there is the code you will be editing in this workshop. It comes with the **NEM2 Software Development Kit** (layer 3). NEM2-SDK is the primary software development tool to create NEM2 components, such as other tools, libraries or applications.

During this workshop, we are going to use the **Typescript SDK**.

2\. Install **typescript** globally. 

{% highlight console %}
npm install -g typescript
{% endhighlight %}

3\. Run the ``project``.

{% highlight console %}
cd project
npm install
npm start
{% endhighlight %}

## Installing NEM2-CLI

**NEM2-CLI** conveniently allows you to perform the most commonly used commands from your terminal i.e. using it to interact with the blockchain, setting up and account, sending funds, etc.

Install **nem2-cli** using npm.

{% highlight console %}
npm i -g nem2-cli@0.11.1
{% endhighlight %}
