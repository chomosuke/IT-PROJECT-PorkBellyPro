import React, { useState } from 'react';

export const SearchBox = () => {

    const [searchStr, setSearchStr] = useState({
        search: ""
    })

    // store the text box data
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchStr({
            ...searchStr,
            [event.target.name]: event.target.value
        })
    }

    // TODO: bind search button to the function
    // const changeSearchStr = 

    return (
        <div>
            <input 
                type = "text"
                placeholder = "Search"
                value = {searchStr.search}
                name = "search"
                onChange = {handleChange}
            />

        </div>
    )
}


