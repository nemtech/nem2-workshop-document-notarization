---
layout: post
title:  "Co-signed notarization"
permalink: /lessons/co-signed-notarization/
---

## Background

![recipient-strategy-sink]({{ site.baseurl }}/assets/images/diagram-multisig.png)

Alice and Bob have reached and agreement and formalized it in a digital document. They want to add both signatures and timestamp the document together.

NEM allows the creation of **multisignature accounts**. When you convert an account into [multisig](https://nemtech.github.io/concepts/multisig-account.html), this  cannot announce transactions by itself. It requires other accounts, called cosignatories, to announce the transactions for them.

It is not always necessary to force all cosignatories to cosign the transaction. The contract is set up specifying the minimum number of cosignatories agreement. These properties can be edited afterwards to suit almost all needs.

Some important considerations to keep in mind:

* Once you convert an account to a multisig, you can no longer initiate transactions from that account. Only the cosignatories can start transactions for  the multisig account.
* NEM’s current implementation of multisig is **“M-of-N”**, meaning M can be any number equal to or less than N, i.e., 1-of-4, 2-of-2, 4-of-9, 9-of-10 and so on.
* Multisig accounts can have up to 10 cosignatories.
* An account can be cosigner of up to 5 multisig accounts.
* The number of smallest cosignatures to approve transactions and remove cosignatories is **editable**.
* Multisig accounts can have another multisig as a cosigner, up to 3 levels.


You will create a **2-of-2 multisig account** that represents the digital asset, with cosignatories Alice an Bob.

## Instructions

A notarization is considered to be valid depending on how we agree to read the records. In this case, we will consider that only messages sent from the same notarization account are valid.
 
1\. Open ``Create deterministic account`` tab. Create a new deterministic account for the digital document and sign it with Alice's private key.

2\. Create an account for Bob.

{% highlight console %}
nem2-cli account generate --save
{% endhighlight %}

3\. Go to ``Create Multisig Account`` tab. Create a multisig account:

- **Multisig private key**: notarization private key (deterministic).
- **Cosignatories to add**: Alice and Bob's private key.
- **Min Approval**: 2, meaning two signatures will be required to announce transactions from this account. 
- **Min Removal**: 1, meaning only one cosignatory is required to delete the other from the multisig account.

![screenshot-multisig-account]({{ site.baseurl }}/assets/images/screenshot-multisig-account.png)

Wait until the transaction gets confirmed.

4\. Open ``Cosigned Notarization`` tab and announce the cosigned notarization.

- **File**: test.txt
- **Multisig public key**: notarization public key (deterministic).
- **Signer private key**: Alice's private key.

{% include note.html content="The application uses a new type of transaction to send multisig transactions." %}

**Read more:** [Aggregate transaction](https://nemtech.github.io/concepts/aggregate-transaction.html)

Click ``Notarize`` and wait until you get the message **"Notarization pending to be cosigned with hash A8...E6"**.

5\. Bob has to cosign the transaction as well, as we had set ``minApproval`` to 2.

{% highlight console %}
nem2-cli transaction cosign --profile bob --hash A855F0C49B78100AFB733DF53FD6758615132E7DBBF74C7B856E4CBACF0946E6
{% endhighlight %}

If everything goes well, the status should have changed to: **"Notarization confirmed with hash A8..E6"**.
                                                             
6\. Go to ``Get Notarization`` tab, and search the transaction hash once confirmed.
