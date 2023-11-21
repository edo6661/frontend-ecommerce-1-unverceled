/* eslint-disable @typescript-eslint/no-unused-vars */
import { MutableRefObject } from 'react';

interface ChildrenType {
	children: React.ReactNode;
}

interface User {
	id?: string;
	_id?: string;
	username?: string;
	email?: string;
	photo?: string;
	address?: string;
	phone?: number;
	roles?: string;
	google?: boolean;
	getUsers?: () => void;
}

interface Products {
	_id?: string;
	userId?: User;
	username?: string;
	name: string;
	description: string;
	brand: string;
	category: string;
	createdAt: string;
	photo: string[];
	price: number;
	quantity: number;
	createdAt?: string;
	getReview?: () => void;
	product?: Products;
	reviewedBy?: string[];
	buyers?: number;
}

interface Product {
	product?: Products;
	setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CartProducts {
	_id?: string;
	items?: [CartItem];
	userId?: string;
	quantity?: number;
	totalPrice?: number;
}

interface CartItem {
	isChecked?: boolean;
	productId: Products;
	quantity: number;
	_id?: string;
	totalPrice?: number;
	handleCheckboxChange: (itemId: string, newCheckedValue: boolean) => void;
	total?: number;
	setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
	getCart: () => void;
}

interface Review {
	comment: string;
	productId: string;
	rating: number;
	userId: User;
	__v: number;
	_id: string;
	reviews: Review[];
}

interface PopulatedOrder {
	_id: string;
	name: string;
	price: number;
	photo: string;
	reviewedBy: string[];
}

interface OrderProduct {
	productId: PopulatedOrder;
	quantity: number;
}

interface OrderDocument {
	_id: string;
	userId: User;
	products: OrderProduct[];
	productId: Products;
	totalAmount?: number;
	status: string;
	deliveryMethod?: string;
	paymentMethod?: string;
	cardNumber?: string;
	estimationDeliveryDate?: Date;
	shippingAddress?: string;
	invoiceNumber?: string;
	createdAt?: string;
	reviews?: Review[];
	setOrders: React.Dispatch<React.SetStateAction<OrderDocument[] | []>>;
}

interface ReviewDetails {
	comment: string;
	productId: string;
	rating: number;
	userId: User;
	__v: number;
	_id: string;
}
