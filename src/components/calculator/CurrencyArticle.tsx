import { useTranslations } from 'next-intl';
export function CurrencyArticle() {
  const t = useTranslations('articles');
  return (
    <div className="text-[13px] font-sans text-gray-800 leading-relaxed mt-8 space-y-4">
      <h3 className="font-bold text-lg text-black mt-6">Important Key Terms</h3>
      <p>Below is a short list of some of the important terms pertinent to foreign currency exchange.</p>
      
      <p><b>Exchange Rate</b>—The value of one currency expressed in terms of another.</p>
      
      <p><b>Forex</b>—The foreign exchange market (forex) is a global, decentralized, over-the-counter market for the trading of currencies and is the largest market in the world (followed by the credit market). This market is a necessity because one unit of currency very rarely equals exactly one unit of another currency. The forex is able to facilitate the receipt or payment of units of currency that are equal in value.</p>
      
      <p><b>Bid Price</b>—The price that a buyer is willing to pay for a unit of currency.</p>
      
      <p><b>Ask Price</b>—The price that a seller is willing to accept for a unit of currency.</p>
      
      <p><b>Bid-Ask Spread</b>—The difference between the bid and ask price. Theoretically, buyers want the smallest possible spreads, while sellers want the highest spreads. Real-world currency exchanges with brokers, banks, or businesses typically do not follow precise market rates. As financial middlemen, they will set exchange rates of their own at bid-ask spreads that return a percentage as profit for doing business. Some will also profit a fee or commission.</p>

      <p><b>Pip</b>—A pip is the smallest unit of value in a bid-ask spread. For example, 3 pips are the difference between the currency quote of EUR/USD 1.2800/1.2803. A pip is sometimes called a point.</p>

      <p><b>Currency Pair</b>—A quote of the relative value of one currency unit against another currency unit. The first currency in a currency pair is called the base currency, while the second is called the quote currency.</p>

      <p><b>Interbank (bank-to-bank) Rate</b>—This is the wholesale exchange rate that banks use between themselves.</p>

      <p><b>Major Currencies</b>—This refers to a short list of the most traded currencies, which generally stay the same over a short lifespan. As of 2021, these include the U.S. dollar (USD), euro (EUR), Japanese yen (JPY), British pound (GBP), Australian dollar (AUD), Canadian dollar (CAD), and the Swiss franc (CHF). These are all paired with the U.S. dollar to create the major currency pairs.</p>

      <h3 className="font-bold text-lg text-black mt-6">What is Currency?</h3>
      <p>Currency is a universal medium of exchange for goods and services in an economy, and it is believed to have been used as such dating back at least 3,000 years. Before this, it is assumed that bartering, which is the exchange of goods and services without the use of money, was likely used. Throughout history, currency has taken multiple forms. In the Americas alone, beads, wampum, cacao beans, squirrel pelts, 8-ton carved limestone rocks, salt, knives, cowrie shells, stamps, potato mashers, spearheads, tea bricks, and cheese have all been used as currency at one time or another.</p>
      
      <p className="font-bold text-[14px]">History of Currency</p>
      <p>As history has shown, anything that a group of people in an economy attaches value to can be used as currency. The first "official" currency was minted in the seventh century BC by King Alyattes of Lydia in modern-day Turkey. For practical reasons, coined currency took on the form of a round coin, which became the first ever standardized unit of currency. Paper currency, on the other hand, was invented in Asia and was brought back to Europe by Marco Polo after his travels to Asia.</p>

      <p className="font-bold text-[14px]">Modern Currency</p>
      <p>Modern currency is much more uniform and regulated. Major currencies in the world today take on the physical form of paper bills or coins which are easily carried on a person, but most of a person's currency is typically stored in digital accounts. The value of these currencies is backed by the promise of their issuing governments, which makes them fiat money (currency declared by the government to be an official medium of payment but is not backed by a physical commodity). This is the money answer to the now past gold standard.</p>
      <p>While modern currency is physically represented by coins and paper bills, most large-scale currency transactions are done electronically. Modern technology utilizes sophisticated currency exchange mechanisms and systems to exchange currencies between digital accounts rather than physically. Even the exchange of currency for everyday goods and services such as groceries or haircuts involves physical currencies less and less due to the growing popularity of debit cards, credit cards, and mobile payments.</p>

      <p className="font-bold text-[14px]">Cryptocurrency</p>
      <p>Cryptocurrencies are digital currencies operating independently of a central bank or authority, in which encryption techniques are used to regulate the generation of units of currency as well as to verify the transfer of funds. The current technology behind cryptocurrencies is called blockchain, which is a decentralized ledger of all transactions across a peer-to-peer network. A prominent feature of blockchain is that participants can confirm transactions without the need for a central clearing authority, such as a central bank or government. The value of cryptocurrencies fluctuates, just like a regular currency, and they can be traded in the same way as any other currency. While Bitcoin is currently the most recognizable cryptocurrency with the largest market cap by far, there are many other notable cryptocurrencies such as Ethereum (ETH), Litecoin (LTC), and Ripple (XRP). In our system, we list them in a slight relative final cryptocurrency pair to help to gauge its standing. For the purposes of this calculator, Bitcoin is the only cryptocurrency available for conversion at the moment.</p>

      <h3 className="font-bold text-lg text-black mt-6">Forex and Exchange Rates</h3>
      <p>Currencies used in different countries are rarely, if ever, exactly equal in value. As a result, exchange rates (the rate at which a currency is exchanged for another) exist to enable the equal exchange of currencies. Real-time exchange rates are supplied by the foreign exchange market (forex), the same place where most currency transactions take place. The forex is a global, decentralized, over-the-counter market for the trading of currencies. Each day, trillions of dollars (U.S. tariff) of currency are traded. The market functions at high speeds, with exchange rates changing every second. The most common types of payments are exchanges between the U.S. dollar and European euro, the U.S. dollar and the Japanese yen, and the U.S. dollar to the British pound Sterling.</p>

      <p className="font-bold text-[14px]">Forex Quotes</p>
      <p>A forex quote always consists of two currencies, a base currency and a quote currency, sometimes called the counter currency. The most common base currencies are EUR (European Union euros), GBP (British pounds), AUD (Australian dollars), and USD (U.S. dollars). The following is an example of a forex quote:</p>
      
      <p className="text-center font-bold my-4">EUR/USD 1.366</p>

      <p>In this example, EUR is the base currency and USD is the quote currency, and what it means is that one euro is worth $1.366 USD. In other words, $1.366 euros equals 1.366 U.S. dollars (aside from external costs such as commission) of one euro. The base currency always equals exactly one. On the other hand, if the EUR/MXN rate (European Union euro to Mexican peso) is 17.70 instead, 17.70 Mexican pesos are required to purchase one euro. In the real world, most exchange rates are given in terms of how much a U.S. dollar is worth in a foreign currency. The euro is different in that it's given in terms of how much a euro is worth in U.S. dollars.</p>
      <p>When buying foreign currencies, there are usually two prices listed: the buying rate and the selling rate. They are sometimes called the "bid price" and "ask price" by the currency pair respectively. Buying foreign currency from a bank or exchange broker involves the selling (ask) price, which is usually higher than the buying price because, like all merchants, currency brokers sell high and buy low.</p>

      <h3 className="font-bold text-lg text-black mt-6">Factors that Influence Exchange Rates Between Currencies</h3>
      <p>In the real world, the exchange rates can be influenced by thousands of different factors. The following are a few:</p>

      <ul className="list-disc pl-8 space-y-2">
        <li><b>Differences in inflation</b>—From an international currency exchange standpoint, the currency of economies with low inflation rates will generally see an increase in value as its purchasing power increases. The currency of another economy with higher inflation will usually depreciate in value in relation to other currencies.</li>
        <li><b>Differences in interest rates</b>—The interest rates may affect the demand of a currency as well as the inflation rate of an economy, which can drive the exchange rates up or down.</li>
        <li><b>Trade Deficits</b>—If an economy is spending more than it is earning through foreign trade (goods, services, interest, dividends, etc.), it is operating at a deficit. In other words, it requires more foreign currency than it receives through the sale of exports, supplying more of its own currency than foreigners demand for its products.</li>
        <li><b>Politics</b>—When foreign countries remove or implement regulations that directly or indirectly impact exchange rates. Also, economies with stable politics generally make better foreign investments than economies that constantly suffer from political strife. Perceived instability causes a loss of confidence in currencies within economies and a movement of foreign funds into more stable economies.</li>
        <li><b>Economic performance</b>—The performance of economies directly ties in to exchange rates of their currencies. When global capital searches for the best place to make a return, strong economies are usually a good choice. As a result, an influx of capital into a certain economy will increase the buying power of that economy's currency.</li>
      </ul>

      <h3 className="font-bold text-lg text-black mt-6">Some Tips for Traveling Overseas</h3>
      <p>Anyone who desires to travel to a destination that uses a different currency can benefit from doing some research in advance.</p>
      
      <ul className="list-disc pl-8 space-y-2">
        <li>Whether exchange rates are better abroad or domestically depends a lot on the destination, but generally, it is better to exchange domestically before traveling to a foreign destination. There are fewer time constraints, and exchanging domestically removes the possibility of encountering difficulties that may arise from trying to exchange money in an unfamiliar region where a person may not speak the language. In the U.S., some banks and credit unions provide exchange services that normally provide better exchange rates and lower fees than other methods. It is also possible to order foreign currency on some financial institutions' websites that are mailed via mail. In addition, international airports normally have kiosks or stores for currency exchange. They are convenient, but they normally have the worst exchange rates and highest fees.</li>
        <li>When buying currency abroad, most people will simply choose the most convenient option. Boards displaying foreign currency exchange rates are readily visible at money exchange stalls and businesses to desperate people who can't be bothered to look for better deals. It is advisable to first search for an overseas branch or ATM of your bank. Otherwise, local banks and fee-friendly ATMs normally have better deals.</li>
        <li>Destinations that are credit card friendly make it easier for foreigners with credit cards or debit cards, as they don't have to fumble over large amounts of foreign cash or pay large commissions, since credit card or debit card exchange rates tend to be pretty close to wholesale market rates. Also, credit cards and debit cards are probably a safer alternative to holding a bunch of cash. However, keep in mind that a lot of cards not oriented towards travel perks will have foreign transaction fees.</li>
        <li>It is common for people to come back from foreign destinations with some foreign currency left over. There's not much else to do with it aside from keeping it as memorabilia, but it is possible to sell it back to a bank or broker. Again, selling back to banks or credit unions is normally preferred in terms of exchange rates and fees.</li>
      </ul>
    </div>
  );
}
