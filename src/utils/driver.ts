const steps = [
    {
       element: '#new1',
       popover: {
         title: '邀请朋友',
         description: '在此处邀请朋友一起使用项目',
         position: 'bottom'
      },
      onNext: () => {
        // Prevent moving to the next step
        driver.preventMove();
        newColumnName = 'Test';
        createColumn()
        // Perform some action or create the element to move to
        // And then move to that element
        setTimeout(() => {
          driver.moveNext();
        }, 500);
      }
    },
    {
        element: '#second-element-introduction',
        popover: {
          title: 'Title on Popover',
          description: 'Body of the popover',
          position: 'top'
        },
        
      },
    
   ]
   
export default steps