import { useState, useEffect } from 'react';

function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // ! Fungsi handleResize memperbarui nilai windowWidth dengan lebar jendela saat ini.
        const handleResize = () => setWindowWidth(window.innerWidth);
        // ! menambahkan event listener ke objek window yang akan memanggil fungsi handleResize setiap kali jendela diubah ukurannya.
        window.addEventListener('resize', handleResize);
        // ! Pada akhir useEffect, kita mengembalikan fungsi yang akan menghapus event listener ketika komponen dilepas. Ini adalah contoh pembersihan efek samping dan merupakan praktik baik dalam React.
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowWidth;
}

export default useWindowWidth;