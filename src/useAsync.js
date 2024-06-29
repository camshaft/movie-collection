import { useState, useEffect } from 'react';

export default (fn, deps) => {
    const [error, setError] = useState();
    const [data, setData] = useState();
    useEffect(() => {
        fn().then(res => {
            setData(res)
        }, error => {
            setError(error);
        })
        return () => {
        }
    }, deps)
    return { error, data };
}