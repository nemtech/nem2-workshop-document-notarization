---
layout: post
title:  "Delegated notarization"
permalink: /lessons/delegated-notarization/
---

# Background

Public networks require a fee to announce transactions. Bob wants to notarize a digital document, but he doesn't own cat.currency or has enough knowledge about blockchain technology. He opts to delegate the complicated part to a specialized notarization service.

Bob will sign the content of the file using his account. After sending the hash of the file to the specialized company, they will announce the transfer transaction to the blockchain for him.

He can prove he had access to the content of the file by signing the content with his account.

![delegated-notarization]({{ site.baseurl }}/assets/images/diagram-delegated-notarization.png)

## Instructions

1\. Create a new account to identify the notarization company.

{% highlight console %}
nem2-cli account generate

Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): MIJIN_TEST
Do you want to save it? [y/n]: y
Introduce NEM 2 Node URL. (Example: http://localhost:3000): http://localhost:3000
Insert profile name (blank means default and it could overwrite the previous profile): company
New Account:    SADJMU-JPDQ3U-N5HARH-74U4FP-XLHRA7-DCGQKN-SSOI
Public Key:     76386325576C2536F1BA239CE4FA8F24E0EBA0F2CF982C0AB1C7D928A2ECDC10
Private Key:    A2...D5
{% endhighlight %}

2\. Open ``Create Notarization`` tab. Drag and drop Bob's file (you could use the previous txt). Sign the content of the file with his account.

![screenshot-delegated-notarization]({{ site.baseurl }}/assets/images/screenshot-delegated-notarization.png)

3\. The generated signature is added as the message of the transaction. Notarize the transaction using the service's private key. 

You could opt to use the address of the service provider as the sink account for notarization.

4\. Once the transaction is included in a block, Bob can verify that the content of the file has been signed with his account.
