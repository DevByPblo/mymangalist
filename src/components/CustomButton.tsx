interface CustomButtonProps {
  text: string;
  color?: string;       
  link?: string;        
}

const CustomButton: React.FC<CustomButtonProps> =({text,color,link}) =>{
    if (link) {
    return (
      <a href={link} className={`inline-block ${color} text-white px-4 py-2 rounded`}>
        {text}
      </a>
    );
  }
    return (

        <button type="button" className={`text-${color}  px-4 py-2 rounded bg-amber-600`}>{text}</button>
    )


}
export default CustomButton