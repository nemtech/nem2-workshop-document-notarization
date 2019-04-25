---
layout: post
title:  "Enabling notarization updates"
permalink: /lessons/notarization-updates/
---

## Background

![recipient-strategy-asset]({{ site.baseurl }}/assets/images/diagram-recipient-strategy-asset.png)

Alice decided to create an account that represents the notarized digital asset uniquely. You could have the track of the updates done by announcing transactions to the same account. 

## Instructions

1\. Edit the txt file you are notarizing, changing the text to "Lorem Ipsum".


2\. Open the Notarization dashboard in your browser and notarize the edited file. Use as the address to send the notarization the account created in the previous module. Then, sign the notarization with Alice's private key.

![screenshot-update-notarization]({{ site.baseurl }}/assets/images/screenshot-update-notarization.png)

3\. Once confirmed, go to ``Get transactions`` tab. Use the document's account public key to fetch all the transactions. You should see two transactions.

![screenshot-get-updated-notarizations]({{ site.baseurl }}/assets/images/screenshot-get-updated-notarizations.png)

## Concerns

You have sent your transaction to an account that represents the notarization. See that everybody in the network is able to send transactions to this account. 
    
How do we know who is the owner of the asset, or who is allowed to perform updates?

**This logic is kept off-chain.** You could state an address in the first message. Only messages written from that account are valid. Another possibility could be that only transactions sent from the asset account are valid.

    ℹ️When the workshop was created, the best solution was to filter the transactions off-chain. The latest version adds the possibility to [block receiving transactions from specific accounts](https://nemtech.github.io/concepts/account-filter.html).
