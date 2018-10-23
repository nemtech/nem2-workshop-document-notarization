---
layout: post
title:  "Transfer notarization"
permalink: /lessons/transfer-notarization/
---

## Background

Alice wants to transfer the notarization to Bob. The notarization is a **2-of-2 multisig**. Recalling the previous module, only cosignatories are able to announce transactions from a multisig. If Alice removes herself, Bob will be the only one allowed to announce transactions from it.

Multisig contracts are **editable**. Alice can change the multisig account contract, removing herself. We set the ``minRemoval`` to 1, so only one cosignature is required to delete someone from the account.

From that moment, Bob will be the only person allowed to transfer transactions from that account. The notarization will become a **1-of-1 multisig**.

![diagram-transfer]({{ site.baseurl }}/assets/images/diagram-transfer.png)

## Solution

1\. Open ``Create multisig`` tab and click ``Edit multisig``. 

{% highlight bash %}
$> nem2-cli account generate
Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): MIJIN_TEST
Do you want to save it? [y/n]: y
Introduce NEM 2 Node URL. (Example: http://localhost:3000): http://localhost:3000
Insert profile name (blank means default and it could overwrite the previous profile): bob
New Account:    SBTFDZE4RTETKCTGNLIV4HL6ACLZIHUDBVAKACOB
Public Key:     EB770736BC20FF07682849A067423E679C7E2167BAB3CA33DE2EF9B0D088F4EF
Private Key:    88...92
{% endhighlight %}

2\. Fill the form:

* **Signer private key**: Alice's private key.
* **Multisig public key**: Notarization's public key (deterministic).
* **Cosignatories to remove**: Alice's public key.
* **Min Approval Delta**: -1. As we are deleting one of the cosignatories, and the minApproval is set to 2, rest 1 to make it 1-of-1. 

![screenshot-edit-multisig-account]({{ site.baseurl }}/assets/images/screenshot-edit-multisig-account.png)


3\. Click ``Edit multisig`` button. As ``minRemoval`` was set to 1, there is no need for Bob to sign the transaction. Wait until the transactions gets confirmed by the network.