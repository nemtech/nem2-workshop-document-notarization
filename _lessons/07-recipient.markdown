---
layout: post
title:  "Choosing the transaction recipient"
permalink: /lessons/recipient/
---

Until now, we have used a notarization wallet (sink account) as the recipient. Which other accounts can we use? Let's have a look at other options:

![recipient-strategy-sink]({{ site.baseurl }}/assets/images/diagram-recipient-strategy-sink.png)

1\. Continue sending a message to a **sink account**, which you will use to store all your notarizations. You could refer to it as your wallet for notarizations.

**Benefits**:
*  All the notarizations are stored in one place.
* The ownership is transferable. You can share the private key or turn it into a [multisig account](https://nemtech.github.io/concepts/multisig-account.html). 

**Cons**: 
* The notarizations are not updatable. 
* Anyone can send transactions to this account. The validity of the transactions should be defined when reading the blockchain records.

![recipient-strategy-asset]({{ site.baseurl }}/assets/images/diagram-recipient-strategy-asset.png)

2\. A file could represent a **digital identifiable asset**. Use an account for each notarization, representing each file uniquely.

**Benefit**: 
* The notarizations are separated by asset.
* The transactions can be updated.
* The ownership is transferable.

**Cons**:
* Anyone can send transactions to this account. The validity of the transactions should be defined when reading the blockchain records.

The account's private key could be generated in a deterministic way. A private key is a 256-bit integer, which can be generated hashing the file properties and signing it your account.

{% include note.html content="We are using the apostille library to generate a deterministic private key. If the account is not used to send transactions, create a deterministic public key instead. This account won't be able to announce transactions." %}

**Read more:** [Apostille Specification](https://github.com/nemtech/NIP/blob/master/NIPs/nip-0004.md#specification) 

## Instructions

1\. Open ``Create deterministic account`` tab, drag and drop the file, and type Alice's private key. After clicking create, the private key will be created by applying sha256 to the name of the file, and then signing it with Alice's account.

![screenshot-create-deterministic-account]({{ site.baseurl }}/assets/images/screenshot-deterministic-account.png)

Copy the account details somewhere safe. You will be using them during this workshop.

2\. Go back to ``Create notarization`` tab and drag and drop your .txt file. Add the asset as the recipient of the transaction and  use Alice's account to sign the transaction.

In the next exercise, you will see how to update the notarization.
