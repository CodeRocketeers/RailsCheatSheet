# Rails Cheat Sheet

<http://railscheatsheet.com>

It is meant as a public library with the [Ruby on Rails](http://rubyonrails.org) commands. 

## Do you want to add some command?

This page is running on [GitHub Pages](https://pages.github.com) so it is a pure html/css/js.  
Its content is loaded from a **datasource.json** json file located in the root of the page. If you want to contribute, create a [pull request](https://help.github.com/articles/creating-a-pull-request). The only thing you need to do is to update the **datasource.json** file. It's structure is pretty straightforward.

 - **id:** - just increase the last one.            
 - **title:** - title of the sheet.
 - **content:** - the content. Use html as you need. **Do** wrap the whole content to *&lt;p&gt;* (or make more of them). It is not wrapped automatically.
 - **imageUrl:** - absolute path to your Github profile image. Not needed.
 - **commit:** - edit version. If you are creating a new sheet, insert **1**. If you are editing exiting sheet, increase this number by 1.
 - **version:** - if the command is specific for/from particular Rails version, put it here. If the command is comon for all versions, put **any**.
 - **emoticon:** - anything short you want to share with others. Like **:)** or so. It is shown in the right top corner of the sheet in the gray field.
 - **categories:** - string representation of categories. Choose wisely. A category filter in the right sidebar is created from all this categories.