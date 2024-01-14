'use client'

const GenericReadonly = ({ value, isDate }) => {

    const formatted = new Date(value).toLocaleDateString('en-US')
return (
    <span>{isDate ? formatted : `${value}`}</span>
)
}

export default GenericReadonly