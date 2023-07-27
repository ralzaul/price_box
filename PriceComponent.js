import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { fetchPrices } from './actions';

const PriceBox = ({ type, price: initialPrice, index }) => {
    const [price, setPrice] = useState(initialPrice);
    const boxStyle = type === 'buy' ? styles.buyBox : styles.sellBox;
    const dispatch = useDispatch();

    const refreshPrice = async () => {
        const orderBook = await dispatch(fetchPrices());
        const newPrice = orderBook.prices[index][type];
        setPrice(newPrice);
    };

    return (
        <TouchableOpacity onPress={refreshPrice} style={boxStyle}>
            <Text style={styles.priceText}>{price.toFixed(2)}</Text>
        </TouchableOpacity>
    );
};

const PriceComponent = () => {
    const orderBook = useSelector(state => state.order_book);
    const [debouncedPrices, setDebouncedPrices] = useState(orderBook.prices);

    const debouncedSetPrices = debounce(setDebouncedPrices, 500);

    useEffect(() => {
        debouncedSetPrices(orderBook.prices);
    }, [orderBook.prices, debouncedSetPrices]);

    const { width } = useWindowDimensions();

    let displayBuyPrices = [];
    let displaySellPrices = [];
    
    if (width > height) {
        displayBuyPrices = debouncedPrices.map(priceObj => priceObj.buy);
        displaySellPrices = debouncedPrices.map(priceObj => priceObj.sell);
    } else {
        displayBuyPrices = [debouncedPrices[0].buy];
        displaySellPrices = [debouncedPrices[0].sell];
    }

    return (
        <View style={styles.container}>
            {displayBuyPrices.map((price, index) => (
                <PriceBox key={index} type="buy" price={price.buy} index={index} />
            ))}
            {displaySellPrices.map((price, index) => (
                <PriceBox key={index} type="sell" price={price.sell} index={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyBox: {
        width: 50,
        height: 50,
        margin: 5,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sellBox: {
        width: 50,
        height: 50,
        margin: 5,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PriceComponent;