# Form Builder - SDE Intern Frontend Assignment

A comprehensive, production-ready form builder application built with React, TypeScript, and TailwindCSS. This application allows users to create dynamic forms using a drag-and-drop interface, preview forms in real-time, collect responses, and manage form data.

## 🚀 Live Demo

- **Live Application**: [Your deployed URL here]
- **Repository**: [GitHub Repository Link]

## 📋 Features Implemented

### ✅ Core Requirements

1. **Drag-and-Drop Interface**

   - Intuitive field palette with all supported field types
   - Drag fields from palette to form canvas
   - Reorder fields using drag handles
   - Visual feedback during drag operations

2. **Supported Field Types**

   - Text Input
   - Textarea (Multi-line text)
   - Email Input (with validation)
   - Phone Input (with formatting)
   - Number Input
   - Date Picker
   - Dropdown/Select
   - Radio Buttons
   - Checkboxes

3. **Field Configuration**

   - Label and placeholder text
   - Help text for additional context
   - Required field validation
   - Min/Max length constraints
   - Custom pattern matching (regex)
   - Options management for dropdown/radio/checkbox fields

4. **Real-time Form Preview**

   - Live preview as you build
   - Form validation behavior preview
   - Responsive design preview modes

5. **Preview Modes**

   - Desktop view (full width)
   - Tablet view (768px)
   - Mobile view (375px)

6. **Template System**

   - Pre-built templates (Contact Us, Survey, Event Registration)
   - Template categories and organization
   - Create new templates from existing forms
   - Template preview and selection

7. **Multi-step Forms**

   - Create forms with multiple steps
   - Step navigation with validation
   - Visual progress indicator
   - Step-by-step field organization

8. **Shareable Form Links**
   - Generate unique form IDs
   - Shareable URLs for public form access
   - Form filling interface for end users
   - Embed code generation

### ✅ Bonus Features

1. **Auto-save Functionality**

   - Automatic saving to localStorage
   - Toggle auto-save on/off
   - Visual indicators for save status

2. **Response Management**

   - View all form responses
   - Individual response details
   - Response filtering and search
   - Export data to JSON

3. **Dark/Light Theme**

   - Toggle between light and dark modes
   - Persistent theme preferences
   - Consistent styling across all components

4. **Undo/Redo Functionality**

   - Complete history management
   - Undo/redo form changes
   - Visual indicators for available actions

5. **Additional Features**
   - Form validation with detailed error messages
   - Responsive design for all screen sizes
   - Accessibility support (ARIA labels, keyboard navigation)
   - Professional UI/UX design
   - Loading states and error handling

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest
- **State Management**: React Context + useReducer
- **Storage**: localStorage
- **Form Validation**: Custom validation system

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (Radix-based)
│   ├── form-fields/           # Form field components
│   │   ├── FieldWrapper.tsx   # Common field wrapper
│   │   ├── TextField.tsx      # Text input field
│   │   ├── TextareaField.tsx  # Textarea field
│   │   ├── DropdownField.tsx  # Select dropdown
│   │   ├── CheckboxField.tsx  # Checkbox field
│   │   ├── RadioField.tsx     # Radio button field
│   │   └── DateField.tsx      # Date picker field
│   └── form-builder/          # Form builder components
│       ├── FieldPalette.tsx   # Draggable field types
│       ├── FormCanvas.tsx     # Drop area and form builder
│       ├── FieldEditor.tsx    # Field property editor
│       ├── PreviewModes.tsx   # Device preview modes
│       ├── StepManager.tsx    # Multi-step form management
│       ├── TemplateSelector.tsx # Template selection
│       ├── ShareModal.tsx     # Share form modal
│       └── ResponseViewer.tsx # View form responses
├── context/
│   └── FormBuilderContext.tsx # Global state management
├── pages/
│   ├── Index.tsx              # Landing page
│   ├── FormBuilder.tsx        # Main builder interface
│   ├── FormFiller.tsx         # Public form filling
│   ├── FormPreview.tsx        # Form preview page
│   ├── FormResponses.tsx      # Response management
│   └── Templates.tsx          # Template management
├── types/
│   └── form.ts                # TypeScript type definitions
├── utils/
│   ├── formStorage.ts         # localStorage utilities
│   └── formValidation.ts      # Validation logic
└── hooks/
    └── use-toast.ts           # Toast notifications
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd form-builder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## 📱 Usage Guide

### Creating a New Form

1. **Start from Homepage**: Click "Start Building" or "Browse Templates"
2. **Choose Template**: Select a pre-built template or start with a blank form
3. **Build Your Form**:
   - Drag field types from the left palette
   - Drop them onto the form canvas
   - Click fields to edit their properties
   - Use the right panel to configure field settings

### Adding Form Fields

1. **From Palette**: Drag field types to the canvas
2. **Field Configuration**:
   - Set field label and placeholder
   - Add help text for users
   - Configure validation rules
   - Set required fields
   - Add options for dropdown/radio/checkbox fields

### Multi-step Forms

1. **Enable Multi-step**: Toggle the multi-step option
2. **Add Steps**: Click "Add Step" to create form steps
3. **Organize Fields**: Assign fields to specific steps
4. **Configure Steps**: Set step titles and descriptions

### Form Preview

1. **Preview Mode**: Click "Preview" to see how your form looks
2. **Device Testing**: Switch between desktop, tablet, and mobile views
3. **Test Validation**: Fill out the form to test validation rules

### Sharing Forms

1. **Share Button**: Click "Share" to open sharing options
2. **Get Link**: Copy the shareable form URL
3. **Embed Code**: Get HTML embed code for websites
4. **Settings**: Configure form behavior and responses

### Managing Responses

1. **View Responses**: Click "Responses" to see form submissions
2. **Response Details**: Click individual responses for full details
3. **Export Data**: Download responses as JSON
4. **Filter/Search**: Filter responses by date or search content

## 🔧 Configuration

### Form Settings

- **Allow Response Editing**: Let users edit their submissions
- **Require Authentication**: Require login before form access
- **Collect Email Addresses**: Automatically collect user emails
- **Thank You Message**: Custom message after submission
- **Redirect URL**: Redirect users after form submission

### Validation Rules

- **Required Fields**: Mark fields as mandatory
- **Length Constraints**: Set minimum and maximum character limits
- **Pattern Matching**: Use regex for custom validation
- **Type Validation**: Email and phone number format validation

## 🎯 Key Features Detail

### Drag & Drop System

- **HTML5 Drag API**: Native browser drag and drop
- **Visual Feedback**: Hover states and drop indicators
- **Field Reordering**: Drag existing fields to reorder
- **Cross-browser**: Works on all modern browsers

### Validation System

- **Real-time Validation**: Instant feedback as users type
- **Custom Rules**: Regex patterns for complex validation
- **Error Messages**: Clear, helpful error descriptions
- **Step Validation**: Validate individual steps in multi-step forms

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Flexible Layouts**: Adapts to any screen size
- **Touch-friendly**: Large touch targets for mobile
- **Preview Modes**: Test forms on different devices

### Data Management

- **localStorage**: Client-side data persistence
- **Auto-save**: Automatic saving every 2 seconds
- **Export/Import**: JSON data format for portability
- **Response Tracking**: Complete submission history

## 🔒 Data Storage

This application uses localStorage for data persistence:

- **Forms**: Saved with unique IDs
- **Responses**: Linked to form IDs
- **Templates**: Predefined and custom templates
- **Settings**: User preferences and configuration

Note: In a production environment, you would typically replace localStorage with a proper backend database.

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography

- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Monospace fonts

### Components

All UI components are built with Radix UI primitives for:

- **Accessibility**: ARIA compliant components
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Screen Reader**: Compatible with assistive technologies

## 🧪 Testing

The application includes:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Form building and submission flows
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge

Run tests with:

```bash
npm test
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with automatic builds

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist` folder to your hosting provider

## 🐛 Known Issues & Limitations

1. **Data Persistence**: Uses localStorage (client-side only)
2. **File Uploads**: Not implemented in this version
3. **Email Sending**: Would require backend integration
4. **User Authentication**: Basic implementation only

## 🔮 Future Enhancements

1. **Backend Integration**: Database storage and user accounts
2. **Advanced Field Types**: File uploads, signatures, rich text
3. **Analytics Dashboard**: Response analytics and charts
4. **API Integration**: Webhook and third-party integrations
5. **Collaboration**: Multiple users editing same form
6. **A/B Testing**: Form variations and testing
7. **Payment Integration**: Collect payments through forms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**[Your Name]**

- GitHub: [Your GitHub Profile]
- Email: [Your Email]
- LinkedIn: [Your LinkedIn Profile]

## 📞 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description
4. Contact the developer

---

**Built with ❤️ for the SDE Intern Frontend Assignment**
