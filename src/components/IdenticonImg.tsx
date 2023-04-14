import { identicon } from 'minidenticons';
import { useMemo } from "react";

interface IdenticonImgProps {
  username: string;
  saturation?: number;
  lightness?: number;
}

const IdenticonImg = ({ username, saturation, lightness, ...props }: IdenticonImgProps & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const svgURI = useMemo(
    () =>
      'data:image/svg+xml;utf8,' + encodeURIComponent(identicon(username, saturation, lightness)),
    [username, saturation, lightness],
  );
  return <img src={svgURI} alt={username} {...props} />;
};

export default IdenticonImg;
