'use client'
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

export type QRDotType = 'square' | 'rounded' | 'dots'

export interface QRStyledHandle {
  download: (filename: string) => void
}

interface Props {
  value: string
  size?: number
  dotType?: QRDotType
}

const dotConfig: Record<QRDotType, { dots: string; corners: string; cornerDots: string }> = {
  square:  { dots: 'square',        corners: 'square',       cornerDots: 'square' },
  rounded: { dots: 'rounded',       corners: 'extra-rounded', cornerDots: 'dot' },
  dots:    { dots: 'dots',          corners: 'dot',           cornerDots: 'dot' },
}

const QRStyled = forwardRef<QRStyledHandle, Props>(
  ({ value, size = 200, dotType = 'square' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const qrRef = useRef<any>(null)

    useEffect(() => {
      const cfg = dotConfig[dotType]
      import('qr-code-styling').then(({ default: QRCodeStyling }) => {
        qrRef.current = new QRCodeStyling({
          width: size,
          height: size,
          data: value,
          dotsOptions: { color: '#000000', type: cfg.dots as any },
          cornersSquareOptions: { color: '#000000', type: cfg.corners as any },
          cornersDotOptions: { color: '#000000', type: cfg.cornerDots as any },
          backgroundOptions: { color: '#ffffff' },
          qrOptions: { errorCorrectionLevel: 'H' },
        })
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          qrRef.current.append(containerRef.current)
        }
      })
    }, [value, size, dotType])

    useImperativeHandle(ref, () => ({
      download: (filename: string) => {
        qrRef.current?.download({ name: filename, extension: 'png' })
      },
    }))

    return <div ref={containerRef} style={{ lineHeight: 0 }} />
  }
)

QRStyled.displayName = 'QRStyled'
export default QRStyled
