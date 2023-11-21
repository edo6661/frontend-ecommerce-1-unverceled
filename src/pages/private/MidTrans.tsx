import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from '../../config/axiosCredentials';
import Button from '../../components/style/Button';

const MidTrans = () => {
    const { user } = useAuth();
    const [token, setToken] = useState<string>('')
    const [formData, setFormData] = useState({
        order_id: 0,
        gross_amount: 0,
        email: user?.email,
        address: user?.address,
        phone: user?.phone,
    })

    const { order_id, gross_amount } = formData;

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })

    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            // console.log(formData)
            const { data } = await axios.post('/pay', formData);
            console.log(data)
            setToken(data.token);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (token) {
            // @ts-expect-error: gatau midtrans
            window.snap.pay(token, {
                // @ts-expect-error: gatau midtrans
                onSuccess: (result) => {
                    console.log(result)
                    setToken('')

                },// @ts-expect-error: gatau midtrans
                onPending: (result) => {
                    console.log(result)
                    setToken('')

                },
                onError: (err: Error) => {
                    console.log(err)
                    setToken('')

                },
                onClose: () => {
                    console.log("sepuh belum selesai menyelesaikan pembayaran");
                    setToken('')
                }
            })
            setFormData({
                ...formData,
                order_id: 0,
                gross_amount: 0,
            })
        }
        // ! akan aktif kalau state token ada perubahan, misalnya: ada token
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {
        const midTransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

        const scriptTag = document.createElement("script")

        scriptTag.src = midTransUrl;

        scriptTag.setAttribute("data-client-key", import.meta.env.VITE_CLIENT_KEY);

        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        }


    }, [])


    return (
        <>
            <section>
                <form action="" onSubmit={handleSubmit}>
                    <input type="number" name="order_id" placeholder='order_id' value={order_id} onChange={inputChange} />
                    <input type="number" name="gross_amount" placeholder='gross_amount' value={gross_amount} onChange={inputChange} />
                    <Button>submit</Button>
                </form>
            </section>
        </>
    )
}

export default MidTrans