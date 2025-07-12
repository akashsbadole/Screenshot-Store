
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Square, 
  Circle, 
  ArrowRight, 
  Eraser, 
  RotateCcw, 
  Save,
  Crop,
  Sliders
} from 'lucide-react';

interface Screenshot {
  id: string;
  dataUrl: string;
  title: string;
  description: string;
  timestamp: Date;
  shortLink?: string;
}

interface ScreenshotEditorProps {
  screenshot: Screenshot;
  onSave: (screenshot: Screenshot) => void;
}

type Tool = 'pen' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'eraser' | 'crop';

const ScreenshotEditor = ({ screenshot, onSave }: ScreenshotEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [brushSize, setBrushSize] = useState(3);
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#000000', '#ffffff', '#ff8800', '#8800ff', '#88ff00', '#0088ff'
  ];

  const tools = [
    { id: 'pen' as Tool, icon: Palette, label: 'Pen' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'arrow' as Tool, icon: ArrowRight, label: 'Arrow' },
    { id: 'text' as Tool, icon: Type, label: 'Text' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = screenshot.dataUrl;
  }, [screenshot.dataUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (currentTool === 'text') {
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;

    if (currentTool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (currentTool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const addText = () => {
    if (!textInput.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `${brushSize * 6}px Arial`;
    ctx.fillStyle = currentColor;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setTextInput('');
    setShowTextInput(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = screenshot.dataUrl;
  };

  const saveScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedDataUrl = canvas.toDataURL('image/png');
    const editedScreenshot = {
      ...screenshot,
      dataUrl: editedDataUrl
    };

    onSave(editedScreenshot);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Tools */}
        <div className="flex gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool(tool.id)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Colors */}
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                currentColor === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <Label className="text-sm">Size:</Label>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-20"
          />
          <span className="text-sm w-6">{brushSize}</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={saveScreenshot}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Text Input Modal */}
      {showTextInput && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Input
            placeholder="Enter text..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addText()}
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={addText}>
            Add
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTextInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto border rounded-lg shadow-sm cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default ScreenshotEditor;
